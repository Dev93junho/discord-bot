# Contributing to Discord Music Bot 🤝

## Getting Started

Thank you for considering contributing to our Discord bot! This document will guide you through the contribution process.

## Development Setup

1. Fork the repository
2. Clone your fork
```bash
git clone https://github.com/YOUR_USERNAME/discord-bot.git
cd discord-bot
```

3. Install dependencies
```bash
npm install
```

4. Create `.env` file
```bash
cp .env.example .env
# Add your test bot token
```

5. Run in development mode
```bash
npm run dev
```

## Code Style

We use ESLint for code consistency. Please ensure your code follows our style guide:

- Use ES6+ features
- Async/await over callbacks
- Meaningful variable names
- Comment complex logic
- No console.log in production code

## Commit Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

Examples:
```
feat: Add screen capture command
fix: Resolve audio speed issues
docs: Update installation guide
```

## Pull Request Process

1. **Create an issue first** - Discuss the feature/fix
2. **Branch naming**:
   - `feature/description` for features
   - `fix/description` for bugs
   - `docs/description` for documentation

3. **PR Description** should include:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (if UI changes)

4. **Testing**:
   - Add tests for new features
   - Ensure existing tests pass
   - Test manually in Discord

5. **Code Review**:
   - Address review comments
   - Keep discussions professional
   - Update based on feedback

## Feature Development

### Large Features
1. Create a proposal issue
2. Discuss implementation approach
3. Break into smaller PRs if possible
4. Update documentation
5. Add to ROADMAP.md

### Small Features/Fixes
1. Check existing issues
2. Create PR with clear description
3. Link related issues

## Testing

### Running Tests
```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests
```

### Writing Tests
- Test file naming: `*.test.js`
- Use descriptive test names
- Test edge cases
- Mock Discord.js interactions

## Documentation

- Update README.md for new commands
- Add JSDoc comments for functions
- Update ROADMAP.md for feature progress
- Create guides in `/docs` for complex features

## Questions?

- Create an issue with the `question` label
- Join our Discord server (if available)
- Check existing issues/PRs

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what's best for the project

Thank you for contributing! 🎉