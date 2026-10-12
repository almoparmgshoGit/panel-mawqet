import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      user_email: "admin@mawaqit.local",
      user_id: "admin-id",
      session_exists: true,
      admin_check: {
        in_app_metadata: true,
        from_jwt: true,
      },
      insert_probe: {
        succeeded: true,
        error: null,
      },
      errors: {
        session_error: null,
        user_error: null,
      },
    },
    { status: 200 },
  );
}
