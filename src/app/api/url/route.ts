import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/firebase.service';
import { nanoid } from 'nanoid';
import { getSocialPrefix } from '@/lib/services/shortener.service';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        const socialPrefix = getSocialPrefix(url);
        if (!socialPrefix) {
            return NextResponse.json(
                { error: 'URL não corresponde a nenhum prefixo social conhecido' },
                { status: 400 }
            );
        }

        const shortId = nanoid(6);
        
        await db.collection('urls').doc(shortId).set({
            originalUrl: url,
            createdAt: new Date(),
        });
        
        return NextResponse.json({ shortId: `${socialPrefix}${shortId}` });
    } catch (error) {
        console.error('Erro ao encurtar URL:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a requisição' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const shortId = searchParams.get('id');

        if (!shortId) {
            return NextResponse.json(
                { error: 'ID não fornecido' },
                { status: 400 }
            );
        }

        const id = shortId.substring(2);
        
        const doc = await db.collection('urls').doc(id).get();
        
        if (!doc.exists) {
            return NextResponse.json(
                { error: 'URL não encontrada' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ url: doc.data()?.originalUrl });
    } catch (error) {
        console.error('Erro ao recuperar URL:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a requisição' },
            { status: 500 }
        );
    }
} 