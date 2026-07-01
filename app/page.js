'use client'
import { useState, useEffect } from 'react'
import { remark } from 'remark'
import html from 'remark-html'

const defaultMd = `# Your Name
### Full Stack Developer

## About
Write about yourself here.

## Skills
- JavaScript
- React
- Node.js

## Projects
### Project One
Description of project.

## Contact
email@example.com`

const themes = {
  light: { bg: '#faf9f6', text: '#1a1a1a', accent: '#c2410c', muted: '#6b6b6b', line: '#e0ddd6' },
  dark:  { bg: '#14161a', text: '#f2f0eb', accent: '#e8a04c', muted: '#9a9a9a', line: '#2a2d33' },
  neon:  { bg: '#0a0e0a', text: '#e0ffe0', accent: '#39ff88', muted: '#5fae7a', line: '#1f3d2a' },
}

function buildStyledHTML(rawHtml, theme) {
  const t = themes[theme]
  return rawHtml
    .replace(/<h1>/g, `<h1 style="font-family:Georgia,serif;font-size:2.75rem;font-weight:700;letter-spacing:-0.02em;margin:0 0 4px;color:${t.text}">`)
    .replace(/<h3>/g, (m, offset, str) => {
      // first h3 after h1 = subtitle, else section-sub or project title
      return `<h3 style="font-family:Georgia,serif;font-weight:400;font-style:italic;font-size:1.15rem;color:${t.accent};margin:0 0 32px;letter-spacing:0.01em">`
    })
    .replace(/<h2>/g, `<h2 style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${t.accent};margin:40px 0 16px;padding-bottom:8px;border-bottom:1px solid ${t.line}">`)
    .replace(/<p>/g, `<p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;line-height:1.7;color:${t.text};margin:0 0 12px">`)
    .replace(/<ul>/g, `<ul style="margin:0 0 12px;padding-left:20px">`)
    .replace(/<li>/g, `<li style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;line-height:1.9;color:${t.text}">`)
    .replace(/<a /g, `<a style="color:${t.accent};text-decoration:none;border-bottom:1px solid ${t.accent}" `)
}

export default function Home() {
  const [md, setMd] = useState(defaultMd)
  const [output, setOutput] = useState('')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    remark().use(html).process(md).then(f => setOutput(f.toString()))
  }, [md])

  const t = themes[theme]
  const styledOutput = buildStyledHTML(output, theme)

  function downloadSite() {
    const page = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Portfolio</title>
<style>body{margin:0;background:${t.bg}}</style>
</head>
<body>
  <div style="max-width:720px;margin:0 auto;padding:80px 24px;background:${t.bg};min-height:100vh">
    ${styledOutput}
  </div>
</body></html>`
    const blob = new Blob([page], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'portfolio.html'
    a.click()
  }

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="p-4 bg-gray-900 text-white flex flex-col">
        <h2 className="font-bold mb-2">Markdown Input</h2>
        <select value={theme} onChange={e => setTheme(e.target.value)} className="mb-2 text-black p-1 rounded">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="neon">Neon</option>
        </select>
        <textarea
          value={md}
          onChange={e => setMd(e.target.value)}
          className="flex-1 bg-gray-800 p-3 rounded font-mono text-sm"
        />
        <button onClick={downloadSite} className="mt-2 bg-green-600 p-2 rounded">
          Download portfolio.html
        </button>
      </div>

      <div style={{ background: t.bg }} className="overflow-auto">
        <div
          style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}
          dangerouslySetInnerHTML={{ __html: styledOutput }}
        />
      </div>
    </div>
  )
}