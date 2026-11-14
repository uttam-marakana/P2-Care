import examples from "libphonenumber-js/examples.mobile.json";
import metadata from "libphonenumber-js/metadata.mobile.json";
import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js/mobile";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const phoneCountries = getCountries()
  .map((country) => ({
    country,
    name: regionNames.of(country) || country,
    callingCode: getCountryCallingCode(country),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getMaxNationalNumberLength(country) {
  const countryMetadata = metadata.countries[country];
  const mobileLengths = countryMetadata?.[11]?.[1]?.[1];
  const possibleLengths = Array.isArray(mobileLengths)
    ? mobileLengths
    : countryMetadata?.[3];

  const lengths = possibleLengths?.filter(Number.isInteger) ?? [];
  return lengths.length ? Math.max(...lengths) : 15;
}

export function getPhonePlaceholder(country) {
  const example = getExampleNumber(country, examples);
  return example?.nationalNumber || "Enter your mobile number";
}

export function getInternationalPhoneNumber(value, country) {
  const parsed = parsePhoneNumberFromString(value, country);
  return parsed?.country === country && parsed.isValid()
    ? parsed.number
    : null;
}
