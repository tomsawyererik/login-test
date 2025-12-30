<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { createClient } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { User } from '@supabase/supabase-js';

	let { children } = $props();
	let supabase = $state<ReturnType<typeof createClient> | null>(null);
	let user = $state<User | null>(null);
	let checkingAuth = $state(true);
	let isExpanded = $state(true);
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
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 10L10 3L17 10M5 10V16C5 16.5523 5.44772 17 6 17H9V13C9 12.4477 9.44772 12 10 12H10.01C10.5623 12 11.01 12.4477 11.01 13V17H14C14.5523 17 15 16.5523 15 16V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{:else if item.icon === 'training'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M6 14L4 16L6 18M14 14L16 16L14 18M8 6L12 10L8 14M12 6L8 10L12 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M3 3H17C17.5523 3 18 3.44772 18 4V16C18 16.5523 17.5523 17 17 17H3C2.44772 17 2 16.5523 2 16V4C2 3.44772 2.44772 3 3 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{:else if item.icon === 'ranking'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10 2L12.5 8L19 9L14 13.5L15.5 20L10 16.5L4.5 20L6 13.5L1 9L7.5 8L10 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{:else if item.icon === 'statistics'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 17V13M7 17V9M11 17V5M15 17V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{:else if item.icon === 'leaderboard'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M6 12L10 8L14 12M10 2V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M2 18H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{:else if item.icon === 'exercise'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10 2V6M10 14V18M6 10H2M18 10H14M15.6569 4.34315L13.2426 6.75736M6.75736 13.2426L4.34315 15.6569M15.6569 15.6569L13.2426 13.2426M6.75736 6.75736L4.34315 4.34315" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
									</svg>
								{:else if item.icon === 'user'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M10 12C6.13401 12 3 14.134 3 18H17C17 14.134 13.866 12 10 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{:else if item.icon === 'clubs'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M4 14C5.10457 14 6 14.8954 6 16C6 17.1046 5.10457 18 4 18C2.89543 18 2 17.1046 2 16C2 14.8954 2.89543 14 4 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M16 14C17.1046 14 18 14.8954 18 16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16C14 14.8954 14.8954 14 16 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M10 6V10M4 14L8 10M16 14L12 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
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
			<svg 
				class="toggle-arrow" 
				class:rotated={!isExpanded}
				width="20" 
				height="20" 
				viewBox="0 0 20 20" 
				fill="none" 
				xmlns="http://www.w3.org/2000/svg"
			>
				<path 
					d="M12.5 15L7.5 10L12.5 5" 
					stroke="currentColor" 
					stroke-width="2" 
					stroke-linecap="round" 
					stroke-linejoin="round"
				/>
			</svg>
		</button>
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

	.nav-icon svg {
		width: 100%;
		height: 100%;
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

	.main-content {
		width: 100%;
		min-width: 0;
		overflow-x: hidden;
		margin-left: 0;
	}
</style>
