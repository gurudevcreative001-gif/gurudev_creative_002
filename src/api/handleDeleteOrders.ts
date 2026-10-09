import { db } from "../helpers/db";
import { getServerUserSession } from "../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const session = await getServerUserSession(request);

    if (session.user.role !== "admin") {
      return Response.json(
        { error: "ફક્ત Admin જ ઓર્ડર ડિલીટ કરી શકે છે." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));

    if (body.confirm !== "DELETE_ALL_ORDERS") {
      return Response.json(
        { error: "કન્ફર્મેશન જરૂરી છે." },
        { status: 400 }
      );
    }

    const result = await db
      .deleteFrom("videoOrders")
      .executeTakeFirst();

    return Response.json({
      success: true,
      deletedCount: Number(result.numDeletedRows ?? 0n)
    });
  } catch {
    return Response.json(
      { error: "Admin login જરૂરી છે." },
      { status: 401 }
    );
  }
}
