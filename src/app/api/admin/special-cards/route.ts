import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { specialCardSchema } from '@/lib/validation/schemas';
import { db } from '@/lib/db/client';
export async function POST(req:Request){try{await requireAdmin();const p=specialCardSchema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:{code:'VALIDATION',message:'Invalid special card'}},{status:400});const card=await db.card.create({data:{...p.data,cardType:'special',rarity:'special',rarityConfigVersion:'special-v1',stockRemaining:p.data.stockTotal,instances:{create:Array.from({length:p.data.stockTotal},(_,i)=>({serialNumber:`${Date.now()}-${i}-${crypto.randomUUID()}`}))}}});return NextResponse.json({card},{status:201});}catch(e:any){return NextResponse.json({error:{code:e.message==='FORBIDDEN'?'FORBIDDEN':'FAILED',message:'Request rejected'}},{status:e.message==='FORBIDDEN'?403:401});}}
