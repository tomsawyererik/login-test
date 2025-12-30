<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { createClient } from '$lib/supabase/client';
	import { goto } from '$app/navigation';

	let supabase = $state<ReturnType<typeof createClient> | null>(null);
	let exerciseId = $derived($page.url.searchParams.get('exercise'));
	let distance = $derived($page.url.searchParams.get('distance'));
	let exercise = $state<any>(null);
	let loading = $state(true);

	onMount(() => {
		if (browser) {
			supabase = createClient();
			if (exerciseId) {
				fetchExercise();
			} else {
				// Redirect back if no exercise ID
				goto('/training');
			}
		}
	});

	async function fetchExercise() {
		if (!supabase || !exerciseId) return;
		
		loading = true;
		try {
			const { data, error } = await supabase
				.from('exercises')
				.select('*')
				.eq('id', exerciseId)
				.single();

			if (error) {
				console.error('Error fetching exercise:', error);
				goto('/training');
			} else {
				exercise = data;
			}
		} catch (error) {
			console.error('Error fetching exercise:', error);
			goto('/training');
		} finally {
			loading = false;
		}
	}
</script>

<div class="page-container">
	{#if loading}
		<p>Loading...</p>
	{:else if exercise}
		<h1>Training Session</h1>
		<p>Exercise: {exercise.name}</p>
		<p>Distance: {distance}m</p>
		<p>Level: {exercise.level}</p>
		<p>Description: {exercise.short_desc}</p>
	{/if}
</div>

<style>
	.page-container {
		min-height: 100vh;
		padding: 2rem;
		padding-left: calc(64px + 2rem);
		background: #f9fafb;
	}

	h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		text-align: left;
	}

	p {
		margin: 0.5rem 0;
		color: #374151;
	}
</style>

