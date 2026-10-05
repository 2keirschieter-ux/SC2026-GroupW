import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth/session';
import { getCollection } from '@/lib/cards/collection';
import { collectionQuerySchema } from '@/lib/validation/schemas';
export async function GET(req: Request){const user=await currentUser();if(!user)return NextResponse.json({error:{code:'UNAUTHENTICATED',message:'Sign in required'}},{status:401});const p=collectionQuerySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));if(!p.success)return NextResponse.json({error:{code:'VALIDATION',message:'Invalid filters'}},{status:400});const cards=await getCollection(user.id,p.data);return NextResponse.json({cards});}
