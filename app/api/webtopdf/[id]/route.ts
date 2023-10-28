import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const fileName = req.url.split("webtopdf/")[1]
    const combinedPDFFilePath = `./lib/${fileName}`;

    if (fs.existsSync(combinedPDFFilePath)) {
        const pdfBuffer = fs.readFileSync(combinedPDFFilePath);
        const response = new NextResponse(pdfBuffer)
        response.headers.set('content-type', 'application/pdf');
        response.headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
        return response;
    } else {
        console.log("File Not Found")
        return NextResponse.json({ error: 'File Not Found' }, { status: 404 })
    }
  } catch (error) {
    console.error("Error serving PDF:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
};  