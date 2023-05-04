import { PostgrestClient } from '@supabase/postgrest-js'
import { Router } from 'itty-router'

const client = new PostgrestClient(POSTGREST_ENDPOINT)
const router = Router()

addEventListener('fetch', event => {
	event.respondWith(router.handle(event.request))
})

router.get('/users', async () => {
	const { data, error } = await client.from('users').select()

	if (error) throw error
  
	return new Response(JSON.stringify({ users: data }), {
	  headers: { 'content-type': 'application/json' },
	})
})

router.get('/users/:id', async ({ params }) => {
	const { id } = params
	const { data, error } = await client
	.from('users')
	.select()
	.eq('id', id)

	if (error) throw error

  	const user = data.length ? data[0] : null

	return new Response(JSON.stringify({ user }), {
		headers: { 'content-type': 'application/json' },
		status: user ? 200 : 404
	})
})

router.post('/users', async request => {
	const userData = await request.json()
	const { data: user, error } = await client
	  .from('users')
	  .insert([userData])
  
	if (error) throw error
  
	return new Response(JSON.stringify({ user }), {
	  headers: { 'content-type': 'application/json' },
	})
})

router.all('*', () => new Response("Not Found", { status: 404 }))

// async function handleRequest(request) {
// 	const { data, error } = await client
// 		.from('users')
// 		.select()
// 	console.log(data)
// 	if (error) throw error
	
// 	return new Response(JSON.stringify(data), {
// 		headers: {
// 		'Content-type': 'application/json'
// 		}
// 	})
// }

// export default {
// 	async fetch(request, env, ctx) {
// 		return new Response("Hello World!", { status: 200});
// 	},
// };
