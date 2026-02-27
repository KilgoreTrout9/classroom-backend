import { and, or, ilike, sql, eq, getTableColumns, desc } from 'drizzle-orm';
import express from 'express';
import { departments, subjects } from '../db/schema';
import { db } from '../db/index';

const router = express.Router();

// Get all subjects with optional search, filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    // If Search query exists, filter by subject name or code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`)
        )
      );
    }
    
    // If departmentId is provided, filter by department
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    } 

    // Combine all filters using AND if any exist
    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))      
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({ 
        ...getTableColumns(subjects), 
        department: { ...getTableColumns(departments) } 
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

      res.status(200).json({
        data: subjectsList,
        pagination: {
          total: totalCount,
          page: currentPage,
          limit: limitPerPage,
          totalPages: Math.ceil(totalCount / limitPerPage)
        }
      });

  }catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;