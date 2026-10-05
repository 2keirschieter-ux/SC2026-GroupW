import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth/session';
import { idempotencySchema } from '@/lib/validation/schemas';
import { openBooster } from '@/lib/cards/booster';
export async function POST(req:Request){const user=await currentUser();if(!user)return NextResponse.json({error:{code:'UNAUTHENTICATED',message:'Sign in required'}},{status:401});const p=idempotencySchema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:{code:'VALIDATION',message:'Invalid idempotency key'}},{status:400});try{return NextResponse.json(await openBooster(user.id,p.data.idempotencyKey));}catch(e:any){return NextResponse.json({error:{code:e.message||'OPENING_FAILED',message:'Booster could not be completed'}},{status:409});}}
