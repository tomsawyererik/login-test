<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { User } from '@supabase/supabase-js';

	let supabase = $state<ReturnType<typeof createClient> | null>(null);
	let user = $state<User | null>(null);
	let checkingAuth = $state(true);

	onMount(() => {
		if (browser) {
			supabase = createClient();
			checkAuth();
			
			supabase.auth.onAuthStateChange((_event, session) => {
				if (session?.user) {
					user = session.user;
				} else {
					user = null;
				}
				checkingAuth = false;
			});
		}
	});

	async function checkAuth() {
		if (!supabase) return;
		
		checkingAuth = true;
		try {
			const { data: { session }, error } = await supabase.auth.getSession();
			
			if (error) {
				console.error('Auth error:', error);
				user = null;
			} else if (session?.user) {
				user = session.user;
			} else {
				user = null;
			}
		} catch (error) {
			console.error('Error checking auth:', error);
			user = null;
		} finally {
			checkingAuth = false;
		}
	}
</script>

<div class="page-container">
	<div class="page-content">
		<h1>Profile</h1>
		
		{#if checkingAuth}
			<p>Loading...</p>
		{:else if user}
			<div class="profile-section">
				{#if user.user_metadata?.avatar_url || user.user_metadata?.picture}
					<img 
						src={user.user_metadata.avatar_url || user.user_metadata.picture} 
						alt="Profile"
						class="profile-avatar"
					/>
				{/if}
				
				<div class="profile-details">
					<div class="detail-item">
						<label>Name</label>
						<p>{user.user_metadata?.full_name || user.user_metadata?.name || 'Not provided'}</p>
					</div>
					
					{#if user.email}
						<div class="detail-item">
							<label>Email</label>
							<p>{user.email}</p>
						</div>
					{/if}
					
					<div class="detail-item">
						<label>User ID</label>
						<p class="user-id">{user.id}</p>
					</div>
					
					{#if user.created_at}
						<div class="detail-item">
							<label>Member since</label>
							<p>{new Date(user.created_at).toLocaleDateString()}</p>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<p>Please log in to view your profile.</p>
		{/if}
	</div>
</div>

<style>
	.page-container {
		min-height: 100vh;
		padding: 2rem;
		background: #f9fafb;
	}

	.page-content {
		max-width: 800px;
		margin: 0 auto;
		background: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
	}

	.profile-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.profile-avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 3px solid #e5e7eb;
		object-fit: cover;
		align-self: flex-start;
	}

	.profile-details {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail-item label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.detail-item p {
		margin: 0;
		font-size: 1rem;
		color: #1f2937;
	}

	.user-id {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.875rem;
		color: #6b7280;
		word-break: break-all;
	}
</style>

