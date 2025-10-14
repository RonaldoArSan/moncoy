/**
 * Script to create the first admin user
 * Run with: npx tsx scripts/create-admin-user.ts
 */

import { createAdminUser } from '../lib/admin-auth'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('=== Create Admin User ===\n')

  const email = await question('Email: ')
  const name = await question('Name: ')
  const password = await question('Password: ')
  const roleInput = await question('Role (admin/super_admin) [admin]: ')
  const role = roleInput.trim() === 'super_admin' ? 'super_admin' : 'admin'

  if (!email || !name || !password) {
    console.error('Error: All fields are required')
    rl.close()
    process.exit(1)
  }

  console.log('\nCreating admin user...')

  // For first user, there's no creator
  const result = await createAdminUser(
    {
      email,
      name,
      password,
      role
    },
    '' // Empty string for first user
  )

  if (result.success) {
    console.log('\n✓ Admin user created successfully!')
    console.log(`Email: ${result.user?.email}`)
    console.log(`Name: ${result.user?.name}`)
    console.log(`Role: ${result.user?.role}`)
  } else {
    console.error(`\n✗ Error: ${result.error}`)
    process.exit(1)
  }

  rl.close()
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
