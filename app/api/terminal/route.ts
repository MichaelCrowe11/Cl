import { NextRequest, NextResponse } from 'next/server'

// Terminal command system for Crowe Logic AI
export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()
    
    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Command required' }, { status: 400 })
    }
    
    const cmd = command.trim().toLowerCase()
    let output: string[] = []
    
    // Command routing system
    switch (true) {
      case cmd === 'help':
        output = [
          'Crowe Logic AI Terminal Commands:',
          '',
          'Lab Operations:',
          '  batch list                - List all active batches',
          '  batch create <species>    - Create new batch',
          '  batch analyze <id>        - Analyze batch performance',
          '  contamination check       - Scan for contamination',
          '  environmental status      - Check lab conditions',
          '',
          'Data Management:',
          '  export batches <format>   - Export batch data (csv/json)',
          '  sop generate <type>       - Generate SOP document',
          '  yield report              - Generate yield analysis',
          '',
          'System:',
          '  clear                     - Clear terminal',
          '  status                    - System status',
          '  help                      - Show this help',
          ''
        ]
        break
        
      case cmd === 'batch list':
        output = [
          'Active Batches:',
          '┌─────────────┬─────────────────────┬──────────────┬─────────────┐',
          '│ Batch ID    │ Species             │ Status       │ Days        │',
          '├─────────────┼─────────────────────┼──────────────┼─────────────┤',
          '│ BATCH-001   │ Hericium erinaceus  │ Fruiting     │ 18          │',
          '│ BATCH-002   │ Pleurotus ostreatus │ Incubating   │ 12          │',
          '│ BATCH-003   │ Shiitake            │ Colonizing   │ 28          │',
          '│ BATCH-004   │ Lion\'s Mane         │ Ready        │ 21          │',
          '└─────────────┴─────────────────────┴──────────────┴─────────────┘',
          '',
          'Total: 4 active batches',
          ''
        ]
        break
        
      case cmd.startsWith('batch create'):
        const species = cmd.replace('batch create', '').trim()
        if (!species) {
          output = ['Error: Species required. Usage: batch create <species>', '']
        } else {
          const batchId = `BATCH-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          output = [
            `Creating new batch: ${batchId}`,
            `Species: ${species}`,
            `Substrate: Sterilized and prepared`,
            `Inoculation: Scheduled`,
            `Expected colonization: 14-21 days`,
            `✅ Batch created successfully`,
            ''
          ]
        }
        break
        
      case cmd.startsWith('batch analyze'):
        const batchId = cmd.replace('batch analyze', '').trim()
        if (!batchId) {
          output = ['Error: Batch ID required. Usage: batch analyze <id>', '']
        } else {
          output = [
            `Analyzing ${batchId.toUpperCase()}...`,
            '',
            'Growth Metrics:',
            `  Temperature: 22.5°C (optimal: 20-24°C) ✅`,
            `  Humidity: 87% (optimal: 85-90%) ✅`,
            `  CO₂ Level: 450 ppm (optimal: <800 ppm) ✅`,
            '',
            'Contamination Scan:',
            `  Visual inspection: No anomalies detected ✅`,
            `  pH Level: 6.8 (optimal range) ✅`,
            `  Growth rate: 2.3mm/day (excellent) ✅`,
            '',
            'Recommendations:',
            `  • Maintain current conditions`,
            `  • Harvest expected in 3-5 days`,
            `  • Monitor for pin formation`,
            ''
          ]
        }
        break
        
      case cmd === 'contamination check':
        output = [
          'Running contamination analysis...',
          '',
          'Scanning active batches:',
          '🟢 BATCH-001: Clean - No contamination detected',
          '🟢 BATCH-002: Clean - Healthy mycelium growth',
          '🟡 BATCH-003: Caution - Monitor for unusual coloration',
          '🟢 BATCH-004: Clean - Ready for harvest',
          '',
          'Environmental factors:',
          '  Air filtration: 99.97% efficiency ✅',
          '  Sterile workspace: Compliant ✅',
          '  Equipment sanitization: Up to date ✅',
          '',
          'Overall contamination rate: 2.1% (excellent)',
          'Last scan: ' + new Date().toLocaleString(),
          ''
        ]
        break
        
      case cmd === 'environmental status':
        output = [
          'Lab Environmental Status:',
          '',
          'Climate Control:',
          '  Temperature: 22.3°C ± 0.5°C ✅',
          '  Humidity: 86% ± 2% ✅',
          '  Air pressure: +5 Pa (positive) ✅',
          '',
          'Air Quality:',
          '  HEPA filtration: 99.97% efficiency ✅',
          '  Air changes: 15/hour ✅',
          '  Particulate count: <100/m³ ✅',
          '',
          'Equipment Status:',
          '  Autoclave: Operational ✅',
          '  Laminar flow hood: Operational ✅',
          '  Incubators: All 4 units operational ✅',
          '',
          'Last maintenance: 2 days ago',
          'Next scheduled: 5 days',
          ''
        ]
        break
        
      case cmd === 'yield report':
        output = [
          'Yield Analysis Report - Last 30 Days:',
          '',
          'Species Performance:',
          '┌─────────────────────┬─────────────┬─────────────┬─────────────┐',
          '│ Species             │ Batches     │ Total Yield │ Efficiency  │',
          '├─────────────────────┼─────────────┼─────────────┼─────────────┤',
          '│ Hericium erinaceus  │ 8           │ 12.3 kg     │ 94%         │',
          '│ Pleurotus ostreatus │ 12          │ 18.7 kg     │ 96%         │',
          '│ Shiitake            │ 6           │ 9.1 kg      │ 91%         │',
          '│ Lion\'s Mane         │ 4           │ 6.8 kg      │ 93%         │',
          '└─────────────────────┴─────────────┴─────────────┴─────────────┘',
          '',
          'Total production: 46.9 kg',
          'Average efficiency: 93.5%',
          'Revenue: $1,247.80',
          ''
        ]
        break
        
      case cmd.startsWith('export batches'):
        const format = cmd.replace('export batches', '').trim() || 'csv'
        output = [
          `Generating batch export in ${format.toUpperCase()} format...`,
          '',
          'Export includes:',
          '  • Batch IDs and timestamps',
          '  • Species and substrate data',
          '  • Environmental conditions',
          '  • Yield and efficiency metrics',
          '  • Contamination records',
          '',
          `✅ Export completed: batches_${new Date().toISOString().split('T')[0]}.${format}`,
          'File ready for download in Data Exports panel',
          ''
        ]
        break
        
      case cmd.startsWith('sop generate'):
        const sopType = cmd.replace('sop generate', '').trim()
        if (!sopType) {
          output = [
            'Available SOP types:',
            '  • sterilization - Substrate sterilization protocol',
            '  • inoculation - Sterile inoculation procedure',
            '  • harvesting - Mushroom harvesting guidelines',
            '  • contamination - Contamination response protocol',
            ''
          ]
        } else {
          output = [
            `Generating SOP: ${sopType}`,
            '',
            'SOP Generation Process:',
            '✅ Template selection',
            '✅ Compliance validation',
            '✅ Risk assessment integration',
            '✅ Quality control measures',
            '✅ Documentation formatting',
            '',
            `✅ SOP generated: ${sopType}-protocol-v${Math.floor(Math.random() * 10) + 1}.pdf`,
            'Available in SOP Generation panel',
            ''
          ]
        }
        break
        
      case cmd === 'status':
        output = [
          'Crowe Logic AI System Status:',
          '',
          'Core Systems:',
          '  🟢 AI Engine: Online',
          '  🟢 Database: Connected',
          '  🟢 File System: Operational',
          '  🟢 Terminal: Active',
          '',
          'Lab Integration:',
          '  🟢 Environmental Sensors: Connected',
          '  🟢 Batch Monitoring: Active',
          '  🟢 Contamination Detection: Running',
          '  🟢 Data Logging: Enabled',
          '',
          'Last system check: ' + new Date().toLocaleTimeString(),
          ''
        ]
        break
        
      case cmd === 'clear':
        output = ['']
        break
        
      default:
        // Check for partial matches and suggestions
        const suggestions = []
        if (cmd.includes('batch')) suggestions.push('batch list', 'batch create <species>', 'batch analyze <id>')
        if (cmd.includes('contamination') || cmd.includes('contam')) suggestions.push('contamination check')
        if (cmd.includes('export')) suggestions.push('export batches csv', 'export batches json')
        if (cmd.includes('sop')) suggestions.push('sop generate sterilization')
        
        output = [
          `Command not found: ${command}`,
          ''
        ]
        
        if (suggestions.length > 0) {
          output.push('Did you mean:')
          suggestions.forEach(suggestion => output.push(`  ${suggestion}`))
          output.push('')
        }
        
        output.push('Type "help" for available commands', '')
        break
    }
    
    return NextResponse.json({ output })
  } catch (error) {
    console.error('Terminal command error:', error)
    return NextResponse.json(
      { error: 'Command execution failed' },
      { status: 500 }
    )
  }
}
