export const fieldToLabel: Record<string, string> = {
  // Scores des sets
  scoreSet1Team1: "le premier set de l'équipe 1",
  scoreSet1Team2: "le premier set de l'équipe 2",
  scoreSet2Team1: "le deuxième set de l'équipe 1",
  scoreSet2Team2: "le deuxième set de l'équipe 2",
  scoreSet3Team1: "le troisième set de l'équipe 1",
  scoreSet3Team2: "le troisième set de l'équipe 2"
};

export function getFieldFromLabel(
  fieldName: string, 
  defaultValue?: string
): string {
  return fieldToLabel[fieldName] || defaultValue || `le champ "${fieldName}"`;
}