import { NextResponse } from "next/server";
import { getAdminCredentials, createAdminToken } from "@/lib/adminAuth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get credentials from environment variables (server-side only)
    const credentials = getAdminCredentials();

    // Validate credentials
    if (
      username === credentials.username &&
      password === credentials.password
    ) {
      // Create token
      const token = createAdminToken();

      return NextResponse.json({
        success: true,
        token,
        message: "تم تسجيل الدخول بنجاح",
      });
    }

    // Invalid credentials
    return NextResponse.json(
      {
        success: false,
        error: "اسم المستخدم أو كلمة المرور غير صحيحة",
      },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء تسجيل الدخول",
      },
      { status: 500 },
    );
  }
}
