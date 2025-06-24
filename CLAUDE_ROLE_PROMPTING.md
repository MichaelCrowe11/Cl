# Giving Claude a role with a system prompt

> **Note**
> While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips).

When using Claude, you can dramatically improve its performance by using the `system` parameter to give it a role. This technique, known as role prompting, is the most powerful way to use system prompts with Claude.

The right role can turn Claude from a general assistant into your virtual domain expert!

> **Tip**: **System prompt tips**: Use the `system` parameter to set Claude's role. Put everything else, like task-specific instructions, in the `user` turn instead.

## Why use role prompting?

- **Enhanced accuracy:** In complex scenarios like legal analysis or financial modeling, role prompting can significantly boost Claude's performance.
- **Tailored tone:** Whether you need a CFO's brevity or a copywriter's flair, role prompting adjusts Claude's communication style.
- **Improved focus:** By setting the role context, Claude stays more within the bounds of your task's specific requirements.

---

## How to give Claude a role

Use the `system` parameter in the [Messages API](https://console.anthropic.com/api/reference/messages) to set Claude's role:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=2048,
    system="You are a seasoned data scientist at a Fortune 500 company.",  # <-- role prompt
    messages=[
        {"role": "user", "content": "Analyze this dataset for anomalies: <dataset>{{DATASET}}</dataset>"}
    ]
)

print(response.content)
```

> **Tip**: **Role prompting tip**: Experiment with roles! A `data scientist` might see different insights than a `marketing strategist` for the same data. A `data scientist specializing in customer insight analysis for Fortune 500 companies` might yield different results still!

---

## Examples

### Example 1: Legal contract analysis

#### Without role prompting

| Role      | Content |
|-----------|---------|
| **User**      | Analyze this software licensing agreement for potential risks:
```xml
<contract>
{{CONTRACT}}
</contract>
```
Focus on indemnification, liability, and IP ownership. |
| **Assistant** | Here's a summary of the key points in the software licensing agreement:

1. Indemnification (Section 8):
   - We indemnify the vendor against claims arising from our use.

2. Limitation of Liability (Section 9):
   - Damages capped at $500.

3. IP Ownership (Section 12):
   - We retain ownership of our modifications.

Overall, the agreement seems standard. The indemnification and liability clauses are typical, and we maintain our IP rights. |

#### With role prompting

| Role      | Content |
|-----------|---------|
| **User**      | You are the General Counsel of a Fortune 500 tech company. We're considering this software licensing agreement for our core data infrastructure:
```xml
<contract>
{{CONTRACT}}
</contract>
```
Analyze it for potential risks, focusing on indemnification, liability, and IP ownership. Give your professional opinion. |
| **Assistant** | I've reviewed the software licensing agreement, and I have serious concerns that could expose our company to significant risks:

1. **Indemnification (Section 8):**
   - Critical Issue: We indemnify the vendor against "any and all claims" arising from our use.
   - Risk: This could hold us liable even for the vendor's negligence or product defects.
   - Recommendation: Reject. Limit our indemnity to claims arising from our violation of the agreement.

2. **Limitation of Liability (Section 9):**
   - Critical Issue: Damages capped at $500, including direct damages.
   - Risk: Grossly inadequate. A critical failure in our data infrastructure could cost us millions in lost revenue and reputational damage.
   - Recommendation: Reject. Negotiate for cap at 12 months of fees for direct damages, and carve-outs for data breaches.

3. **IP Ownership (Section 12):**
   - Critical Issue: Vendor gains joint ownership of our modifications and integrations.
   - Risk: They could use or sell our proprietary algorithms or data insights to competitors.
   - Recommendation: Reject. We must retain full ownership of our work.

**Professional Opinion:** Do not sign this agreement. It is grossly unfavorable and exposes us to unacceptable levels of risk. If the vendor refuses to renegotiate these terms, I strongly advise exploring alternative providers or accelerating our in-house solution. The potential costs of proceeding with this agreement far outweigh any short-term gains. |

---

### Example 2: Financial analysis

#### Without role prompting

| Role      | Content |
|-----------|---------|
| **User**      | Analyze this dataset of our Q2 financials:
```xml
<data>
{{FINANCIALS}}
</data>
```
Highlight key trends and recommend actions. |
| **Assistant** | Here's a summary of your Q2 financials:

1. Revenue: $15.2M, up 22% YoY. Enterprise client base grew 30%.
2. Gross Margin: 72%, up 3% from Q1.
3. EBITDA Margin: 18%, down 2% due to R&D investments.
4. Cash Flow: $4.1M operating, $28M in reserves.

Overall, financials look strong with revenue growth and healthy margins. Increased R&D spending is impacting profitability but could pay off long-term. Maintain current course. |

#### With role prompting

| Role      | Content |
|-----------|---------|
| **User**      | You are the CFO of a high-growth B2B SaaS company. We're in a board meeting discussing our Q2 financials:
```xml
<data>
{{FINANCIALS}}
</data>
```
Analyze key trends, flag concerns, and recommend strategic actions. Our investors want aggressive growth but are wary of our burn rate. |
| **Assistant** | Board members, here's my analysis of our Q2 financials:

1. **Revenue ($15.2M, +22% YoY):**
   - Insight: Enterprise growth (+30%) is outpacing overall growth.
   - Flag: SMB segment declined 5%.
   - Action: Reallocate 20% of SMB marketing budget to enterprise sales. Task product to simplify SMB onboarding.

2. **Margins (Gross: 72%, +3% QoQ; EBITDA: 18%, -2% QoQ):**
   - Insight: Infrastructure optimizations boosted gross margins.
   - Flag: R&D spend on AI features dented EBITDA.
   - Action: No change. Our AI roadmap is critical for enterprise stickiness.

3. **Cash ($4.1M OCF, $28M reserves):**
   - Insight: 15-month runway at current burn.
   - Flag: CAC up 20%, eroding LTV/CAC.
   - Action: Freeze non-essential hires. Implement sales funnel analytics to cut CAC by 15% in Q3.

**Strategic Stance:** We're threading the needle between growth and burn. Enterprise focus is our growth engine—invest there. But watch SMB churn; it could bleed into enterprise. Our AI bet is sound, but we must convert it to ARR by Q4, or we cut R&D by 30%.

**In sum:** Double down on enterprise, streamline SMB, optimize sales, and monetize AI.

---

### Additional Resources

- **Prompt library**: [Prompt Library](https://example.com/prompt-library)
- **GitHub prompting tutorial**: [Anthropic's interactive tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial)
- **Google Sheets prompting tutorial**: [Interactive spreadsheet](https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8) 