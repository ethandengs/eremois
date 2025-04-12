# Contributing to erēmois

We love your input! We want to make contributing to erēmois as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Setup

1. Fork the repo and create your branch from `main`
2. Install dependencies: `cd apps/web && npm install`
3. Set up your environment:
   - Copy `.env.example` to `.env.local`
   - Create a free Supabase project at [supabase.com](https://supabase.com)
   - Add your Supabase credentials to `.env.local`
4. Run the development server: `npm run dev`

### Supabase Setup for Development

1. Create a free Supabase project
2. Go to Project Settings -> API
3. Copy the following values to your `.env.local`:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - `anon` public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Optional: Enable additional auth providers in Authentication -> Providers

### Database Migrations

When making changes to the database schema:
1. Test your changes in the Supabase dashboard
2. Add the SQL migrations to `supabase/migrations/`
3. Document the changes in your PR

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the documentation with any new environment variables or dependencies
3. The PR will be merged once you have the sign-off of two other developers

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker](https://github.com/yourusername/eremois/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License. 