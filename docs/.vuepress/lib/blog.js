const axios = require('axios')

const API_BASE = (process.env.BLOG_API_URL || 'https://cms.efemrl.xyz').replace(/\/+$/, '')
const SITE = process.env.BLOG_SITE || 'sp'

const POST_TIMESTAMPS = {}
const DISPLAY_TO_TIMESTAMP = {}

const escapeHtml = str => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const formatDate = ts => new Date(ts).toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
})

const formatDateTime = ts => new Date(ts).toLocaleDateString('en-US', {
  dateStyle: 'long', timeZone: 'UTC',
})

function normalise (articles) {
  return articles
    .filter(a => a && typeof a.slug === 'string' && a.slug && typeof a.title === 'string' && a.title)
    .map(a => ({
      slug: String(a.slug),
      title: String(a.title),
      body: typeof a.body === 'string' ? a.body : '',
      html: typeof a.html === 'string' ? a.html : '',
      format: a.format === 'html' ? 'html' : 'md',
      metaDescription: typeof a.meta_description === 'string' ? a.meta_description : null,
      imageUrl: typeof a.image_url === 'string' ? a.image_url : null,
      tags: Array.isArray(a.tags) ? a.tags.filter(t => typeof t === 'string') : [],
      createdAt: Number.isFinite(a.created_at) ? a.created_at : null,
      updatedAt: Number.isFinite(a.updated_at) ? a.updated_at : null,
    }))
    .sort((x, y) => (y.createdAt || 0) - (x.createdAt || 0))
}

async function fetchPosts () {
  if (!API_BASE) {
    console.log('BLOG_API_URL is unset; skipping blog generation')
    return []
  }

  const url = `${API_BASE}/s/${encodeURIComponent(SITE)}`

  try {
    const res = await axios.get(url, { timeout: 15000 })
    const articles = res.data && Array.isArray(res.data.articles) ? res.data.articles : []
    const posts = normalise(articles)
    console.log(`Fetched ${posts.length} blog post(s) from ${url}`)
    return posts
  } catch (e) {
    const status = e.response ? ` (HTTP ${e.response.status})` : ''
    console.error(`Failed to fetch blog posts from ${url}${status}: ${e.message}`)
    return []
  }
}

const defuseMustaches = md => md.replace(/\{\{/g, '<span v-pre>{{</span>')

function renderBody (post) {
  if (post.format === 'md' && post.body) return defuseMustaches(post.body)
  return `<div class="blog-post-body" v-pre>${post.html}</div>`
}

function postPage (post) {
  const path = `/blog/${post.slug}/`
  const ts = post.updatedAt || post.createdAt
  if (ts) POST_TIMESTAMPS[path] = ts

  const frontmatter = { title: post.title, sidebarDepth: 2 }
  if (post.metaDescription) frontmatter.description = post.metaDescription

  const meta = []
  if (post.metaDescription) {
    meta.push({ name: 'description', content: post.metaDescription })
    meta.push({ property: 'og:description', content: post.metaDescription })
  }
  meta.push({ property: 'og:title', content: post.title })
  meta.push({ property: 'og:type', content: 'article' })
  if (post.imageUrl) meta.push({ property: 'og:image', content: post.imageUrl })
  frontmatter.meta = meta

  const heading = `<h1 v-pre>${escapeHtml(post.title)}</h1>`
  const date = post.createdAt
    ? `<span class="blog-post-date">${escapeHtml(formatDate(post.createdAt))}</span>`
    : ''
  const tags = post.tags
    .map(t => `<span class="blog-post-tag">${escapeHtml(t)}</span>`)
    .join('')
  const byline = date || tags
    ? `\n<p class="blog-post-meta" v-pre>${date}${tags}</p>\n`
    : ''

  return {
    path,
    frontmatter,
    content: `${heading}\n${byline}\n${renderBody(post)}\n`,
  }
}

function indexPage (posts) {
  const items = posts.map(post => {
    const date = post.createdAt
      ? ` <span class="blog-list-date">${escapeHtml(formatDate(post.createdAt))}</span>`
      : ''
    const summary = post.metaDescription
      ? `<br><span class="blog-list-summary">${escapeHtml(post.metaDescription)}</span>`
      : ''
    return `<li><a href="/blog/${encodeURIComponent(post.slug)}/">${escapeHtml(post.title)}</a>${date}${summary}</li>`
  }).join('\n')

  const body = posts.length
    ? `<ul class="blog-list" v-pre>\n\n${items}\n\n</ul>`
    : '_No posts yet. Check back soon._'

  return {
    path: '/blog/',
    frontmatter: {
      title: 'Blog',
      description: 'News and articles about Socialite Providers',
    },
    content: `# Blog\n\n${body}\n`,
  }
}

async function blogPages () {
  const posts = await fetchPosts()

  const pages = [indexPage(posts)].concat(posts.map(postPage))
  const sidebar = [
    {
      title: 'Blog',
      collapsable: false,
      children: [['/blog/', 'All Posts']].concat(
        posts.map(p => [`/blog/${p.slug}/`, p.title])
      ),
    },
  ]

  return { pages, sidebar }
}

function applyBlogLastUpdated ($page) {
  const ts = POST_TIMESTAMPS[$page.path]
  if (!ts) return
  const display = formatDateTime(ts)
  DISPLAY_TO_TIMESTAMP[display] = ts
  $page.lastUpdated = display
}

function sitemapDateFormatter (lastUpdated) {
  const ts = DISPLAY_TO_TIMESTAMP[lastUpdated]
  return new Date(ts || lastUpdated).toISOString()
}

module.exports = { blogPages, applyBlogLastUpdated, sitemapDateFormatter }
