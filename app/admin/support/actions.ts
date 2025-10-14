"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSupportSettings() {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Supabase client not available")
  }
  const { data } = await supabase.from("support_settings").select("*").single()
  return data
}

export async function saveSupportSettings(settings: any, token: string) {
  if (token !== process.env.ADMIN_EDIT_TOKEN) {
    throw new Error("Token de administrador inválido")
  }
  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Supabase client not available")
  }
  const { error } = await supabase.from("support_settings").upsert(settings)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/support")
}
