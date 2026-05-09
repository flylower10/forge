# Forge Viewer

Renders Forge agent reference pages and artefacts from their `.md` sources.

## Run

From the Forge root:
```
python3 -m http.server 8080
```

Then open: http://localhost:8080/viewer/

## How it works

Each page reads a `.md` source file with JSON frontmatter and renders it using the Forge design system. Edit the `.md`, reload — the page reflects it.

Sources:
- Agent reference pages: `output/agents/*.md`
- Idea artefacts: `output/[idea-name]/*.md`
