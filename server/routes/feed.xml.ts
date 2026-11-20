// The news as an Atom feed (/feed.xml), prerendered into the static site.
// Entries carry each post's title, date, author and description, and link
// to the post; posts are English, so the feed is too.
import { queryCollection } from '@nuxt/content/server'

const escape = (s: string) => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const isoDay = (d: unknown) => new Date(String(d)).toISOString()

export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  const posts = await queryCollection(event, 'news')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'author')
    .all()

  const updated = posts.length ? isoDay(posts[0]!.date) : new Date(0).toISOString()
  const entries = posts.map((post) => {
    const url = `${site}${post.path}`
    return [
      '  <entry>',
      `    <id>${escape(url)}</id>`,
      `    <title>${escape(post.title ?? '')}</title>`,
      `    <link rel="alternate" type="text/html" href="${escape(url)}"/>`,
      `    <published>${isoDay(post.date)}</published>`,
      `    <updated>${isoDay(post.date)}</updated>`,
      `    <author><name>${escape(post.author || 'The Helix Desktop Project')}</name></author>`,
      `    <summary>${escape(post.description ?? '')}</summary>`,
      '  </entry>',
    ].join('\n')
  })

  const xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">',
    '  <title>Helix news</title>',
    '  <subtitle>Releases, progress and notes from the Helix desktop project.</subtitle>',
    `  <id>${escape(`${site}/news`)}</id>`,
    `  <link rel="alternate" type="text/html" href="${escape(`${site}/news`)}"/>`,
    `  <link rel="self" type="application/atom+xml" href="${escape(`${site}/feed.xml`)}"/>`,
    `  <icon>${escape(`${site}/favicon.svg`)}</icon>`,
    `  <updated>${updated}</updated>`,
    '  <rights>CC0-1.0</rights>',
    ...entries,
    '</feed>',
    '',
  ].join('\n')

  setResponseHeader(event, 'content-type', 'application/atom+xml; charset=utf-8')
  return xml
})
