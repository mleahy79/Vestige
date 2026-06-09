## Placement Mode

Vestige's second core feature answers the question that comes right after 
archaeology: *now that I understand this codebase — where do I put my change?*

### The problem

Opening a 14,000 line stylesheet to add a single style is not a navigation 
problem. It's a confidence problem. You don't know what touches what. You 
don't know if adding to the bottom breaks something at the top through the 
cascade. You don't know the conventions the original author used or why 
they structured it the way they did.

So you do what any reasonable developer does under those conditions — you 
write inline CSS. It works, it's isolated, it doesn't touch anything you 
don't understand. But now you've deviated from the codebase's pattern, and 
the next developer inherits that deviation without knowing why it's there.

That's how codebases accumulate confusion. One cautious decision at a time.

### What Vestige does

Placement mode reads the existing structure and tells you where your change 
belongs — and why that placement is safe.

Not just a map of what exists. A recommended insertion point based on the 
codebase's own patterns, with a reason attached.

> "Add your style at line 827 in styles.css — this is where component-level 
> overrides live in this project. Adding here keeps it out of the global 
> reset block above and the utility classes below."

You make the change. You know where it is if you need to find it later. 
You know it won't break anything because Vestige read the structure before 
it told you where to go.

### Why these two features and nothing else

Archaeology mode answers: *why is this like this?*
Placement mode answers: *where does my change belong?*

These are the only two questions that matter when you're working in a 
codebase you didn't write. Vestige answers both, in order, and gets out 
of your way.
