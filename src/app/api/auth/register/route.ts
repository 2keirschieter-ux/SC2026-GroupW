import { NextResponse } from 'next/server';
import { credentialsSchema, validationMessage } from '@/lib/validation/schemas';
import { register } from '@/lib/auth/register';
export async function POST(req: Request){const parsed=credentialsSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:{code:'VALIDATION',message:validationMessage(parsed.error)}},{status:400});try{return NextResponse.json({user:await register(parsed.data.email,parsed.data.password)},{status:201});}catch(e:any){if(e.code==='P2002')return NextResponse.json({error:{code:'DUPLICATE_EMAIL',message:'An account with this email already exists'}},{status:409});return NextResponse.json({error:{code:'REGISTRATION_FAILED',message:'Registration failed'}},{status:500});}}
