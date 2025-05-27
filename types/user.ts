import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type userDetail = z.infer<typeof userSchema>;

export interface jwtValidationReturn {
  status: number;
  email?: string;
}

export interface userJWTPayload {
  email: string;
}

export interface userExistReturn {
  exist: boolean;
  user?: userDetail;
}
