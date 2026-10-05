import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth/session';
import { progress } from '@/lib/cards/progress';
export async function GET(){const u=await currentUser();if(!u)return NextResponse.json({error:{code:'UNAUTHENTICATED',message:'Sign in required'}},{status:401});return NextResponse.json(await progress(u.id));}
