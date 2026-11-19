"use client"

// /v3 (where this site's leads come from). NEXT_PUBLIC_RECORD_FORM=one-step|two-step swaps the
// zero-distraction form for the property-record form (components/v2/record-survey-card.tsx),
// with this site's own address gate, answer ids (lib/form-rules.ts "zdf") and scoring.
// Unset = the zero-distraction form, untouched (unset + redeploy = rollback). Other pages
// are not affected.
import type { ComponentProps } from "react"
import { ZeroDistractionForm } from "@/components/survey/zero-distraction-form"
import type { AddressDetails, ServiceArea } from "@/components/survey/address-autocomplete"
import { RecordSurveyCard } from "@/components/v2/record-survey-card"
import { RECORD_BRAND } from "@/lib/brand"
import { isAddressAllowed } from "@/lib/service-area"

type Props = ComponentProps<typeof ZeroDistractionForm> & { companyName?: string }

export function ZeroDistractionFormWithRecordForm({ companyName, ...props }: Props) {
  if (!RECORD_BRAND.recordForm) return <ZeroDistractionForm {...props} />
  // No phone on the screen-out page: the /v3 form's screen-out page shows none.
  const brand = { ...RECORD_BRAND, companyName: companyName || RECORD_BRAND.companyName, phoneDisplay: "", phoneHref: "" }
  const areas: ServiceArea[] = props.serviceAreas
  return (
    <RecordSurveyCard
      brand={brand}
      mode={RECORD_BRAND.recordMode}
      serviceAreas={areas}
      // The /v3 form's gate: lib/service-area.ts (circles / counties, minus excluded states and places).
      addressAllowed={(details: AddressDetails) => isAddressAllowed(details, areas)}
      outsideAreaText="Sorry, that address is outside our buying area. Please enter a property in our service area."
      areaNote="We only buy in our service area."
    />
  )
}
