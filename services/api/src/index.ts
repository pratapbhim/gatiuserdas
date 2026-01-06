import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { prisma } from './prismaClient';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Pages list (admin)
app.get('/admin/pages', async (_req, res) => {
  const pages = await prisma.page.findMany({ include: { sections: true } });
  res.json(pages);
});

app.post('/admin/pages', async (req, res) => {
  const { slug, title, description } = req.body;
  const page = await prisma.page.create({
    data: { slug, title, description: description || '' },
  });
  res.status(201).json(page);
});

// Sections: add
app.post('/admin/pages/:pageId/sections', async (req, res) => {
  const { pageId } = req.params;
  const { type, props } = req.body;
  const section = await prisma.section.create({
    data: { pageId, type, props, order: 999 },
  });
  res.status(201).json(section);
});

// Media list
app.get('/admin/media', async (_req, res) => {
  const media = await prisma.media.findMany();
  res.json(media);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Admin API listening on ${port}`);
});


