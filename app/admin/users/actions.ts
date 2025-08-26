"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { User } from "@supabase/supabase-js"

export async function getUsers() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) throw new Error(error.message)
  return data.users.map((u: User) => ({
    id: u.id,
    name: u.user_metadata.full_name || u.email,
    email: u.email || "",
    plan: u.user_metadata.plan || "Básico",
    status: u.user_metadata.status || "Ativo",
    joinDate: u.created_at,
  }))
}

export async function updateUser(userId: string, data: any) {
  const supabase = createClient()
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: data,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/users")
}

export async function createUser(data: any) {
  const supabase = createClient()
  const { error } = await supabase.auth.admin.createUser({
    email: data.email,
    password: "password", // Temporary password, user should reset
    user_metadata: {
      full_name: data.name,
      plan: data.plan,
      status: data.status,
    },
    email_confirm: true,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/users")
}

export async function deleteUser(userId: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/users")
}
