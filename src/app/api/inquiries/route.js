// src/app/api/inquiries/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
    try {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("luxury_estates");

        // Fetch all inquiries from the database
        const inquiries = await db
            .collection("inquiries")
            .find({})
            .sort({ submitted_at: -1 }) // Sort by submitted_at in descending order (newest first)
            .toArray();

        return NextResponse.json({ inquiries }, { status: 200 });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}