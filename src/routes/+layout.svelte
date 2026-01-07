<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { createClient } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { User } from '@supabase/supabase-js';
	import { Home, Target, Trophy, BarChart3, Award, Activity, User as UserIcon, Users, ChevronLeft } from 'lucide-svelte';

	let { children } = $props();
	let supabase = $state<ReturnType<typeof createClient> | null>(null);
	let user = $state<User | null>(null);
	let checkingAuth = $state(true);
	let isExpanded = $state(false);
	let panelWidth = $derived(isExpanded ? 280 : 64);

	const navItems = [
		{ path: '/', label: 'Home', icon: 'home' },
		{ path: '/training', label: 'Training', icon: 'training' },
		{ path: '/ranking-games', label: 'Ranking Games', icon: 'ranking' },
		{ path: '/statistics', label: 'Statistics', icon: 'statistics' },
		{ path: '/leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
		{ path: '/exercise-rankings', label: 'Exercise Rankings', icon: 'exercise' },
		{ path: '/profile', label: 'Profile', icon: 'user' },
		{ path: '/manage-clubs', label: 'Manage Clubs', icon: 'clubs' }
	];

	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}

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

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !checkingAuth && user}
	<div class="app-container">
		<aside class="side-panel" class:collapsed={!isExpanded}>
			<nav class="nav-menu">
				<div class="nav-items">
					{#each navItems as item}
						<a
							href={item.path}
							class="nav-item"
							class:active={isActive(item.path)}
							onclick={(e) => {
								e.preventDefault();
								goto(item.path);
							}}
							title={!isExpanded ? item.label : ''}
						>
							<div class="nav-icon">
								{#if item.icon === 'home'}
									<Home size={20} />
								{:else if item.icon === 'training'}
									<Target size={20} />
								{:else if item.icon === 'ranking'}
									<Trophy size={20} />
								{:else if item.icon === 'statistics'}
									<BarChart3 size={20} />
								{:else if item.icon === 'leaderboard'}
									<Award size={20} />
								{:else if item.icon === 'exercise'}
									<Activity size={20} />
								{:else if item.icon === 'user'}
									<UserIcon size={20} />
								{:else if item.icon === 'clubs'}
									<Users size={20} />
								{/if}
							</div>
							{#if isExpanded}
								<span class="nav-label">{item.label}</span>
							{/if}
						</a>
					{/each}
				</div>
			</nav>
		</aside>
		<button 
			class="toggle-button" 
			style="left: {panelWidth - 14}px;"
			onclick={() => isExpanded = !isExpanded}
			aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
		>
			<div class="toggle-arrow" class:rotated={!isExpanded}>
				<ChevronLeft size={20} />
			</div>
		</button>
		{#if isExpanded}
			<div 
				class="backdrop"
				onclick={() => isExpanded = false}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
						isExpanded = false;
					}
				}}
				aria-label="Close sidebar"
			></div>
		{/if}
		<main class="main-content">
			{@render children()}
		</main>
	</div>
{:else}
{@render children()}
{/if}

<style>
	.app-container {
		display: flex;
		min-height: 100vh;
		width: 100%;
		overflow-x: hidden;
		position: relative;
	}

	.side-panel {
		width: 280px;
		background-color: #1f2937;
		color: white;
		overflow-y: auto;
		overflow-x: hidden;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		transition: width 0.3s ease;
		z-index: 10;
	}

	.side-panel.collapsed {
		width: 64px;
	}

	.nav-menu {
		position: relative;
		padding: 1rem 0;
		height: 100%;
	}

	.toggle-button {
		position: absolute;
		top: 1rem;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background-color: #374151;
		border: 2px solid #4b5563;
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 20;
		transition: left 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-button:hover {
		background-color: #4b5563;
		border-color: #6b7280;
		transform: scale(1.1);
	}

	.toggle-arrow {
		transition: transform 0.3s ease;
		color: white;
	}

	.toggle-arrow.rotated {
		transform: rotate(180deg);
	}

	.nav-items {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0 0.75rem;
		margin-top: 2rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: 6px;
		color: #9ca3af;
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
		position: relative;
	}

	.nav-item:hover {
		background-color: #374151;
		color: white;
	}

	.nav-item.active {
		background-color: #374151;
		color: white;
	}

	.nav-item.active::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 60%;
		background-color: #667eea;
		border-radius: 0 2px 2px 0;
	}

	.nav-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
	}

	.nav-label {
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
		opacity: 1;
		transition: opacity 0.2s ease;
	}

	.side-panel.collapsed .nav-label {
		opacity: 0;
		width: 0;
		overflow: hidden;
	}

	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.1);
		z-index: 5;
		cursor: pointer;
	}

	.main-content {
		width: 100%;
		min-width: 0;
		overflow-x: hidden;
		margin-left: 0;
	}
</style>
