import { NextResponse } from 'next/server';
import { cardDetails } from '@/lib/cards/details';
export async function GET(_:Request,{params}:{params:Promise<{cardId:string}>}){const {cardId}=await params;const card=await cardDetails(cardId);if(!card)return NextResponse.json({error:{code:'NOT_FOUND',message:'Card not found'}},{status:404});return NextResponse.json({card:{...card,available:card.cardType==='special'?Boolean(card.stockRemaining):true,instances:undefined}});}
