// client/__tests__/WhatIfSimulator.test.jsx
import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WhatIfSimulator from '../src/components/WhatIf/WhatIfSimulator.jsx'

describe('WhatIfSimulator Component', () => {
  const mockResult = {
    scenario: 'Selected intervention bundle',
    estimatedReduction: '65% (est.)',
    estimatedExposureAqi: 98,
    co2SavedKg: '1.8 kg CO2/day (est.)',
    explanation: 'Metro transit avoids roadside particulate plumes and cuts tailpipe emissions.',
    assumptions: 'Based on CPCB monitors and IIT-Delhi aerosol models.',
  }

  test('renders simulation toggles with accessible states', () => {
    render(
      <WhatIfSimulator
        onRunWhatIf={vi.fn()}
        result={null}
        loading={false}
        currentAqi={280}
      />
    )

    expect(screen.getByText(/Switch Solo Car to Delhi Metro/i)).toBeInTheDocument()
    expect(screen.getByText(/Wear Well-Fitted N95 Mask/i)).toBeInTheDocument()
    expect(screen.getByText(/Calculate Intervention Impact/i)).toBeInTheDocument()
  })

  test('clicking intervention button dispatches choices', () => {
    const handleRun = vi.fn()
    render(
      <WhatIfSimulator
        onRunWhatIf={handleRun}
        result={null}
        loading={false}
        currentAqi={280}
      />
    )

    const calcBtn = screen.getByRole('button', { name: /Calculate Intervention Impact/i })
    fireEvent.click(calcBtn)

    expect(handleRun).toHaveBeenCalledWith(
      expect.objectContaining({
        switchToMetro: true,
        useN95: true,
      })
    )
  })

  test('displays dynamic exposure reduction results when provided', () => {
    render(
      <WhatIfSimulator
        onRunWhatIf={vi.fn()}
        result={mockResult}
        loading={false}
        currentAqi={280}
      />
    )

    expect(screen.getByText('65% (est.)')).toBeInTheDocument()
    expect(screen.getByText(/1.8 kg CO2\/day \(est\.\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Metro transit avoids roadside particulate plumes/i)).toBeInTheDocument()
  })
})
