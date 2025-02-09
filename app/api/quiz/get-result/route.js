import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { QUIZ_RESULTS_TABLE } from '@/configs/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function POST(req) {
    try {
        const { courseId, userId } = await req.json();
        console.log('Fetching quiz result for:', { courseId, userId });

        if (!courseId || !userId) {
            console.log('Missing required parameters');
            return NextResponse.json(
                { error: 'Course ID and User ID are required' },
                { status: 400 }
            );
        }

        // Fetch the latest quiz result for the user and course
        const result = await db
            .select()
            .from(QUIZ_RESULTS_TABLE)
            .where(
                and(
                    eq(QUIZ_RESULTS_TABLE.courseId, courseId),
                    eq(QUIZ_RESULTS_TABLE.userId, userId)
                )
            )
            .orderBy(desc(QUIZ_RESULTS_TABLE.completedAt))
            .limit(1);

        console.log('Quiz result from database:', result);

        return NextResponse.json({ 
            result: result.length > 0 ? result[0] : null 
        });
    } catch (error) {
        console.error('Error fetching quiz result:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz result', details: error.message },
            { status: 500 }
        );
    }
} 