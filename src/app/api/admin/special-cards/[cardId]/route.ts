import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { updateSpecialCard } from '@/lib/cards/admin-special-cards';
export async function PATCH(req:Request,{params}:{params:Promise<{cardId:string}>}){try{await requireAdmin();const {cardId}=await params;return NextResponse.json({card:await updateSpecialCard(cardId,await req.json())});}catch(e:any){const status=['FORBIDDEN'].includes(e.message)?403:['NOT_FOUND'].includes(e.message)?404:['VALIDATION','STOCK_TOO_LOW','INVALID_STOCK'].includes(e.message)?400:500;return NextResponse.json({error:{code:e.message||'FAILED',message:e.message==='STOCK_TOO_LOW'?'Stock cannot be below assigned copies':'Request rejected'}},{status});}}
