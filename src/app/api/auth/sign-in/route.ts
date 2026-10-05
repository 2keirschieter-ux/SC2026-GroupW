import { NextResponse } from 'next/server';
import { credentialsSchema, validationMessage } from '@/lib/validation/schemas';
import { signIn } from '@/lib/auth/sign-in';
export async function POST(req: Request){const p=credentialsSchema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:{code:'VALIDATION',message:validationMessage(p.error)}},{status:400});try{return NextResponse.json({user:await signIn(p.data.email,p.data.password)});}catch{return NextResponse.json({error:{code:'INVALID_CREDENTIALS',message:'Invalid email or password'}},{status:401});}}
