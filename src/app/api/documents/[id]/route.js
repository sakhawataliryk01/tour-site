import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Dokument nicht gefunden.' }, { status: 404 });
  }

  const doc = await prisma.tourDocument.findFirst({
    where: {
      id,
      published: true,
      visibility: 'PUBLIC',
    },
    include: {
      media: true,
    },
  });

  if (!doc?.media) {
    return NextResponse.json({ error: 'Dokument nicht gefunden.' }, { status: 404 });
  }

  const url = doc.media.url;
  if (!url) {
    return NextResponse.json(
      { error: 'Dokument hat keine gültige Download-URL.' },
      { status: 404 }
    );
  }

  return NextResponse.redirect(url, 302);
}
