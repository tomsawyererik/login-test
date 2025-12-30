<script lang="ts">
	import { createClient } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { User } from '@supabase/supabase-js';

	let supabase = $state<ReturnType<typeof createClient> | null>(null);
	let email = $state('');
	let otpCode = $state('');
	let showOtpInput = $state(false);
	let loading = $state(false);
	let message = $state('');
	let connectionStatus = $state<'checking' | 'connected' | 'error' | null>(null);
	let connectionMessage = $state('');
	let user = $state<User | null>(null);
	let session = $state<any>(null);
	let checkingAuth = $state(true);

	onMount(() => {
		// Only create client on the browser
		if (browser) {
			supabase = createClient();
			
			// Check authentication status
			checkAuth();
			
			// Listen for auth changes
			supabase.auth.onAuthStateChange((_event, session) => {
				if (session?.user) {
					user = session.user;
					session = session;
				} else {
					user = null;
					session = null;
				}
				checkingAuth = false;
			});
		}
	});

	async function checkAuth() {
		if (!supabase) return;
		
		checkingAuth = true;
		try {
			const { data: { session: currentSession }, error } = await supabase.auth.getSession();
			
			if (error) {
				console.error('Auth error:', error);
				user = null;
				session = null;
			} else if (currentSession?.user) {
				user = currentSession.user;
				session = currentSession;
			} else {
				user = null;
				session = null;
			}
		} catch (error) {
			console.error('Error checking auth:', error);
			user = null;
			session = null;
		} finally {
			checkingAuth = false;
		}
	}

	async function testConnection() {
		if (!supabase) return;
		
		connectionStatus = 'checking';
		try {
			// Test if we can reach Supabase by checking the session
			const { error } = await supabase.auth.getSession();
			
			if (error) {
				// Check if it's a configuration error
				const errorMessage = error.message || 'Unknown error';
				if (errorMessage.includes('Invalid API key') || errorMessage.includes('JWT') || errorMessage.includes('Invalid')) {
					connectionStatus = 'error';
					connectionMessage = '✗ Configuration error: Check your SUPABASE_PUBLISHABLE_KEY';
					return;
				}
			}
			
			// If we get here, connection is working
			connectionStatus = 'connected';
			connectionMessage = '✓ Connected to Supabase';
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network') || errorMessage.includes('fetch')) {
				connectionStatus = 'error';
				connectionMessage = '✗ Connection error: Check your SUPABASE_URL and network connection';
			} else {
				connectionStatus = 'error';
				connectionMessage = `✗ Error: ${errorMessage}`;
			}
		}
	}

	async function handleLogout() {
		if (!supabase) return;
		
		loading = true;
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			
			user = null;
			session = null;
			message = 'Logged out successfully';
		} catch (error) {
			message = error instanceof Error ? error.message : 'Error logging out';
		} finally {
			loading = false;
		}
	}

	async function handleMagicLink() {
		if (!supabase) return;
		
		if (!email) {
			message = 'Please enter your email address';
			return;
		}

		loading = true;
		message = '';
		showOtpInput = false;
		otpCode = '';

		try {
			const { data, error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					shouldCreateUser: true
				}
			});

			if (error) {
				console.error('Magic link error:', error);
				
				// Provide more helpful error messages
				if (error.message.includes('email')) {
					message = `Email error: ${error.message}. Check your Supabase email configuration.`;
				} else if (error.message.includes('rate limit')) {
					message = 'Too many requests. Please wait a moment and try again.';
				} else {
					message = `Error: ${error.message}`;
				}
				return;
			}

			// Success - show OTP input as fallback
			showOtpInput = true;
			message = '✓ Email sent! Check your inbox for the magic link.';
		} catch (error) {
			console.error('Unexpected error:', error);
			message = error instanceof Error ? `Unexpected error: ${error.message}` : 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}

	async function handleOtpVerification() {
		if (!supabase) return;
		
		if (!otpCode || otpCode.length !== 6) {
			message = 'Please enter a valid 6-digit code';
			return;
		}

		loading = true;
		message = '';

		try {
			const { data, error } = await supabase.auth.verifyOtp({
				email,
				token: otpCode,
				type: 'email'
			});

			if (error) {
				console.error('OTP verification error:', error);
				message = `Verification failed: ${error.message}`;
				return;
			}

			if (data?.user) {
				user = data.user;
				session = data.session;
				showOtpInput = false;
				otpCode = '';
				message = '✓ Successfully verified!';
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			message = error instanceof Error ? `Error: ${error.message}` : 'An error occurred during verification';
		} finally {
			loading = false;
		}
	}

	async function handleSocialLogin(provider: 'google' | 'facebook') {
		if (!supabase) {
			message = 'Error: Supabase client not initialized. Please refresh the page.';
			return;
		}
		
		loading = true;
		message = '';

		try {
			console.log('Starting OAuth login with', provider);
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (error) {
				console.error('OAuth error:', error);
				throw error;
			}

			// The redirect should happen automatically, but log for debugging
			console.log('OAuth redirect data:', data);
			
			// If we get here and no redirect happened, show a message
			setTimeout(() => {
				if (!data?.url) {
					message = 'OAuth redirect did not start. Please check your browser console for errors.';
					loading = false;
				}
			}, 1000);
		} catch (error) {
			console.error('OAuth login error:', error);
			message = error instanceof Error ? error.message : 'An error occurred during OAuth login';
			loading = false;
		}
	}
</script>

{#if checkingAuth}
	<div class="login-container">
		<div class="login-card">
			<p>Checking authentication...</p>
		</div>
	</div>
{:else if user}
	<!-- Logged in view -->
	<div class="page-container">
		<h1>
			Welcome back, {(() => {
				const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
				const firstName = fullName.split(' ')[0];
				return firstName;
			})()}!
		</h1>
		
		<div class="stats-grid">
			<div class="stat-box stat-box-blue">
				<h2 class="stat-title">Shooting level</h2>
				<p class="stat-value">1</p>
			</div>
			
			<div class="stat-box stat-box-green">
				<h2 class="stat-title">Total Badges</h2>
				<p class="stat-value">0</p>
			</div>
			
			<div class="stat-box stat-box-purple">
				<h2 class="stat-title">This Week</h2>
				<p class="stat-value">0</p>
			</div>
			
			<div class="stat-box stat-box-orange">
				<h2 class="stat-title">Avg Accuracy</h2>
				<p class="stat-value">0.00%</p>
			</div>
		</div>
	</div>
{:else}
	<!-- Login view -->
	<div class="login-container">
		<div class="login-card">
			<h1>Welcome</h1>
			<p class="subtitle">Sign in to your account</p>

		{#if connectionStatus}
			<div class="connection-status" class:error={connectionStatus === 'error'} class:checking={connectionStatus === 'checking'}>
				{connectionStatus === 'checking' ? '⏳ Checking connection...' : connectionMessage}
			</div>
		{/if}

		{#if message}
			<div class="message" class:error={message.includes('error') || message.includes('Error')}>
				{message}
			</div>
		{/if}


		<form onsubmit={(e) => { e.preventDefault(); handleMagicLink(); }}>
			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					placeholder="you@example.com"
					bind:value={email}
					disabled={loading || showOtpInput}
					required
				/>
			</div>

			{#if showOtpInput}
				<div class="form-group">
					<label for="otp">6-Digit Code (if email didn't arrive)</label>
					<input
						id="otp"
						type="text"
						placeholder="000000"
						bind:value={otpCode}
						disabled={loading}
						maxlength="6"
						pattern="[0-9]{6}"
						autocomplete="one-time-code"
					/>
					<button 
						type="button" 
						onclick={handleOtpVerification} 
						disabled={loading || !otpCode || otpCode.length !== 6} 
						class="btn btn-primary"
					>
						{loading ? 'Verifying...' : 'Verify Code'}
					</button>
				</div>
			{:else}
				<button type="submit" disabled={loading} class="btn btn-primary">
					{loading ? 'Sending...' : 'Send Magic Link'}
				</button>
			{/if}
		</form>

		{#if !showOtpInput}
			<div class="divider">
				<span>or</span>
			</div>
		{/if}

		<div class="social-buttons">
			<button
				type="button"
				onclick={() => handleSocialLogin('google')}
				disabled={loading}
				class="btn btn-social btn-google"
			>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path
						d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
						fill="#4285F4"
					/>
					<path
						d="M9 18c2.43 0 4.467-.806 5.965-2.184l-2.908-2.258c-.806.54-1.837.86-3.057.86-2.35 0-4.34-1.587-5.053-3.72H.957v2.332C2.438 15.983 5.482 18 9 18z"
						fill="#34A853"
					/>
					<path
						d="M3.947 10.698c-.18-.54-.282-1.117-.282-1.698s.102-1.158.282-1.698V4.97H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.03l2.99-2.332z"
						fill="#FBBC05"
					/>
					<path
						d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.97L3.947 7.3C4.66 5.163 6.65 3.58 9 3.58z"
						fill="#EA4335"
					/>
				</svg>
				Continue with Google
			</button>

			<!-- Facebook login temporarily disabled - Facebook app requirements issue -->
			<!--
			<button
				type="button"
				onclick={() => handleSocialLogin('facebook')}
				disabled={loading}
				class="btn btn-social btn-facebook"
			>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path
						d="M18 9C18 4.03 13.97 0 9 0S0 4.03 0 9c0 4.5 3.3 8.22 7.61 8.91v-6.3H5.31V9h2.3V7.02c0-2.27 1.35-3.52 3.42-3.52.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.41V9h2.5l-.4 2.61h-2.1v6.3C14.7 17.22 18 13.5 18 9z"
						fill="#1877F2"
					/>
				</svg>
				Continue with Facebook
			</button>
			-->
		</div>
	</div>
	</div>
{/if}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		width: 100%;
		box-sizing: border-box;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		max-height: 100vh;
		height: 100vh;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		overflow-y: auto;
		overflow-x: hidden;
		width: 100%;
	}

	.login-card {
		background: white;
		border-radius: 12px;
		padding: 2.5rem;
		width: 100%;
		max-width: 420px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		overflow-y: auto;
		max-height: calc(100vh - 2rem);
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		text-align: center;
	}

	.subtitle {
		margin: 0 0 2rem 0;
		color: #6b7280;
		text-align: center;
		font-size: 0.95rem;
	}

	.message {
		padding: 0.75rem 1rem;
		border-radius: 6px;
		margin-bottom: 1.5rem;
		background-color: #d1fae5;
		color: #065f46;
		font-size: 0.875rem;
	}

	.message.error {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.connection-status {
		padding: 0.75rem 1rem;
		border-radius: 6px;
		margin-bottom: 1.5rem;
		background-color: #d1fae5;
		color: #065f46;
		font-size: 0.875rem;
		text-align: center;
		font-weight: 500;
	}

	.connection-status.error {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.connection-status.checking {
		background-color: #fef3c7;
		color: #92400e;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #374151;
		font-weight: 500;
		font-size: 0.875rem;
	}

	input {
		width: 100%;
		max-width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s, box-shadow 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	input:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
	}

	.btn {
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background-color: #667eea;
		color: white;
		margin-bottom: 1.5rem;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #5568d3;
	}

	.divider {
		display: flex;
		align-items: center;
		text-align: center;
		margin: 1.5rem 0;
		color: #9ca3af;
		font-size: 0.875rem;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid #e5e7eb;
	}

	.divider span {
		padding: 0 1rem;
	}

	.social-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.btn-social {
		background-color: white;
		border: 1px solid #d1d5db;
		color: #374151;
	}

	.btn-social:hover:not(:disabled) {
		background-color: #f9fafb;
		border-color: #9ca3af;
	}

	.btn-google {
		background-color: white;
	}

	.page-container {
		min-height: 100vh;
		padding: 2rem;
		padding-left: calc(64px + 2rem);
		background: #f9fafb;
	}

	.page-container h1 {
		margin: 0 0 2rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		text-align: left;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.stat-box {
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 10px -2px rgba(0, 0, 0, 0.15);
		border: none;
	}

	.stat-box-blue {
		background: #3b82f6;
	}

	.stat-box-green {
		background: #10b981;
	}

	.stat-box-purple {
		background: #8b5cf6;
	}

	.stat-box-orange {
		background: #f97316;
	}

	.stat-title {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: white;
	}

</style>
