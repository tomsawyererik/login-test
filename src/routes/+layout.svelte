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
		{ path: '/profile', label: 'Profile', icon: 'user' },
		{ path: '/about', label: 'About', icon: 'info' }
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
								{:else if item.icon === 'user'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M10 12C6.13401 12 3 14.134 3 18H17C17 14.134 13.866 12 10 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								{:else if item.icon === 'info'}
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M10 14V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M10 6H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
