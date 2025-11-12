import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  await dbConnect();

  // Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split("Bearer ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Get all user documents
    const documents = await SRSForm.find({
      $or: [{ userId: userId }, { createdBy: userId }]
    }).sort({ createdAt: -1 });

    // Calculate analytics
    const totalDocuments = documents.length;
    
    // Calculate completeness for each document
    const documentsWithStats = documents.map(doc => {
      const fields = [
        'projectName', 'purpose', 'scope', 'definitions', 'references',
        'productPerspective', 'productFunctions', 'userClasses', 'operatingEnvironment',
        'constraints', 'userDocumentation', 'assumptions', 'userInterfaces',
        'hardwareInterfaces', 'softwareInterfaces', 'communicationInterfaces',
        'performance', 'security', 'reliability', 'maintainability',
        'usability', 'portability', 'businessRules', 'legalCompliance',
        'standardsCompliance', 'glossary', 'notes'
      ];
      
      const filledFields = fields.filter(field => doc[field] && doc[field].trim() !== '').length;
      const totalFields = fields.length;
      const completeness = Math.round((filledFields / totalFields) * 100);
      
      // Count features
      const featureCount = doc.features ? doc.features.filter(f => f.name && f.name.trim() !== '').length : 0;
      
      return {
        id: doc._id,
        projectName: doc.projectName,
        completeness,
        filledFields,
        totalFields,
        featureCount,
        hasMarkdown: !!doc.markdown,
        hasPDF: !!doc.pdfUrl,
        createdAt: doc.createdAt,
      };
    });

    // Overall statistics
    const averageCompleteness = documentsWithStats.length > 0
      ? Math.round(documentsWithStats.reduce((sum, doc) => sum + doc.completeness, 0) / documentsWithStats.length)
      : 0;

    const totalFeatures = documentsWithStats.reduce((sum, doc) => sum + doc.featureCount, 0);
    const documentsWithPDF = documentsWithStats.filter(doc => doc.hasPDF).length;
    const documentsWithMarkdown = documentsWithStats.filter(doc => doc.hasMarkdown).length;

    // Completeness distribution
    const completenessDistribution = {
      complete: documentsWithStats.filter(doc => doc.completeness === 100).length,
      high: documentsWithStats.filter(doc => doc.completeness >= 75 && doc.completeness < 100).length,
      medium: documentsWithStats.filter(doc => doc.completeness >= 50 && doc.completeness < 75).length,
      low: documentsWithStats.filter(doc => doc.completeness < 50).length,
    };

    // Recent activity (last 5 documents)
    const recentDocuments = documentsWithStats.slice(0, 5);

    // Trend data (documents created per month - last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyData = {};
    documents.forEach(doc => {
      if (doc.createdAt >= sixMonthsAgo) {
        const month = new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });

    const trendData = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count
    }));

    return NextResponse.json({
      totalDocuments,
      averageCompleteness,
      totalFeatures,
      documentsWithPDF,
      documentsWithMarkdown,
      completenessDistribution,
      recentDocuments,
      trendData,
      documents: documentsWithStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
