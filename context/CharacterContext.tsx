import React, { createContext, useState, useMemo, useEffect, useContext, ReactNode } from 'react';
import { 
  DOMINIONS, TRAITS_DATA, HOUSES_DATA, HOUSE_UPGRADES_DATA, 
  TRUE_SELF_TRAITS, ALTER_EGO_TRAITS, UNIFORMS_DATA, MAGICAL_STYLES_DATA, 
  BUILD_TYPES_DATA, HEADMASTERS_DATA, TEACHERS_DATA,
  DURATION_DATA, CLUBS_DATA, MISC_ACTIVITIES_DATA, CLASSMATES_DATA,
  BLESSING_ENGRAVINGS, COMMON_SIGILS_DATA, SPECIAL_SIGILS_DATA,
  GOOD_TIDINGS_SIGIL_TREE_DATA,
  COMPELLING_WILL_SIGIL_TREE_DATA, TELEKINETICS_DATA, METATHERMICS_DATA,
  WORLDLY_WISDOM_SIGIL_TREE_DATA, ELEANORS_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA,
  BITTER_DISSATISFACTION_SIGIL_TREE_DATA, BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA,
  LOST_HOPE_SIGIL_TREE_DATA, CHANNELLING_DATA, NECROMANCY_DATA, BLACK_MAGIC_DATA,
  FALLEN_PEACE_SIGIL_TREE_DATA, TELEPATHY_DATA, MENTAL_MANIPULATION_DATA,
  GRACIOUS_DEFEAT_SIGIL_TREE_DATA, ENTRANCE_DATA, FEATURES_DATA, INFLUENCE_DATA,
  CLOSED_CIRCUITS_SIGIL_TREE_DATA, NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA,
  RIGHTEOUS_CREATION_SIGIL_TREE_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA, RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA,
  STAR_CROSSED_LOVE_PACTS_DATA, STAR_CROSSED_LOVE_SIGIL_TREE_DATA,
  LIMITLESS_POTENTIAL_RUNES_DATA, ALLMILLOR_CHOICES_DATA, CAREER_GOALS_DATA,
  COLLEAGUES_DATA, CUSTOM_COLLEAGUE_CHOICES_DATA, RETIREMENT_CHOICES_DATA, CHILD_OF_GOD_DATA
} from '../constants';
import type { BitterDissatisfactionPower, ClosedCircuitsPower, CompellingWillPower, FallenPeacePower, GraciousDefeatPower, LostHopePower, RighteousCreationPower, StarCrossedLovePact, WorldlyWisdomPower, ClosedCircuitsSigil, RighteousCreationSigil, StarCrossedLoveSigil } from '../types';

// --- Helper Functions and Constants ---
const PARENT_COST_MAP: { [key: number]: number } = { 0: -20, 1: -10, 2: 0, 3: 3, 4: 8, 5: 15, 6: 24 }; // FP cost
const SIBLING_COST_PER = 3; // FP cost per sibling

type Cost = { fp: number; bp: number };

const parseCost = (costString: string): Cost => {
  const cost: Cost = { fp: 0, bp: 0 };
  if (!costString || costString.toLowerCase().includes('free') || costString.toLowerCase().includes('costs 0') || costString.toLowerCase().includes('variable')) {
    return cost;
  }
  
  const isGrant = costString.toLowerCase().startsWith('grants');
  
  let processedString = costString;
  if (costString.toLowerCase().includes('or')) {
    processedString = costString.split(/or/i)[0];
  }

  // Handle costs like "use -3 BP"
  processedString = processedString.replace(/use (-?\d+)/, '$1');
  
  const fpMatch = processedString.match(/(-?\d+)\s*FP/i);
  if (fpMatch) {
    let value = parseInt(fpMatch[1], 10);
    if (isGrant) {
      cost.fp = -Math.abs(value);
    } else {
      cost.fp = Math.abs(value);
    }
  }

  const bpMatch = processedString.match(/(-?\d+)\s*BP/i);
  if (bpMatch) {
    let value = parseInt(bpMatch[1], 10);
    if (isGrant) {
      cost.bp = -Math.abs(value);
    } else {
      cost.bp = Math.abs(value);
    }
  }
  
  return cost;
};

// --- Context Definition ---
interface ICharacterContext {
  // State
  selectedDominionId: string | null;
  blessingPoints: number;
  fortunePoints: number;
  numParents: number;
  numSiblings: number;
  selectedTraits: Set<string>;
  selectedHouseId: string | null;
  selectedUpgrades: Set<string>;
  selectedTrueSelfTraits: Set<string>;
  selectedAlterEgoTraits: Set<string>;
  selectedUniformId: string | null;
  selectedMagicalStyles: Set<string>;
  selectedBuildTypeId: string | null;
  selectedHeadmasterId: string | null;
  selectedTeacherIds: Set<string>;
  selectedDurationId: string | null;
  selectedClubIds: Set<string>;
  selectedMiscActivityIds: Set<string>;
  selectedClassmateIds: Set<string>;
  selectedBlessingEngraving: string | null;
  isMultiplayer: boolean;
  
  // Sigil State
  acquiredCommonSigils: Map<string, number>;
  acquiredLekoluJobs: Map<string, number>;
  selectedSpecialSigilChoices: Map<string, Set<string>>;
  availableSigilCounts: {
      kaarn: number;
      purth: number;
      juathas: number;
      xuth: number;
      sinthru: number;
      lekolu: number;
  };
   totalSigilCounts: {
      kaarn: number;
      purth: number;
      juathas: number;
      xuth: number;
      sinthru: number;
      lekolu: number;
  };

  // Good Tidings State
  selectedGoodTidingsTier: 'standard' | 'journeyman' | 'master' | null;
  selectedEssentialBoons: Set<string>;
  selectedMinorBoons: Set<string>;
  selectedMajorBoons: Set<string>;
  availableEssentialBoonPicks: number;
  availableMinorBoonPicks: number;
  availableMajorBoonPicks: number;
  isMinorBoonsBoosted: boolean;
  isMajorBoonsBoosted: boolean;

  // Blessings State
  selectedCompellingWillSigils: Set<string>;
  selectedTelekinetics: Set<string>;
  selectedMetathermics: Set<string>;
  availableTelekineticsPicks: number;
  availableMetathermicsPicks: number;
  isTelekineticsBoosted: boolean;
  isMetathermicsBoosted: boolean;

  selectedWorldlyWisdomSigils: Set<string>;
  selectedEleanorsTechniques: Set<string>;
  selectedGenevievesTechniques: Set<string>;
  availableEleanorsPicks: number;
  availableGenevievesPicks: number;
  isEleanorsTechniquesBoosted: boolean;
  isGenevievesTechniquesBoosted: boolean;
  
  selectedBitterDissatisfactionSigils: Set<string>;
  selectedBrewing: Set<string>;
  selectedSoulAlchemy: Set<string>;
  selectedTransformation: Set<string>;
  availableBrewingPicks: number;
  availableSoulAlchemyPicks: number;
  availableTransformationPicks: number;
  isBrewingBoosted: boolean;
  isSoulAlchemyBoosted: boolean;
  isTransformationBoosted: boolean;

  selectedLostHopeSigils: Set<string>;
  selectedChannelling: Set<string>;
  selectedNecromancy: Set<string>;
  selectedBlackMagic: Set<string>;
  availableChannellingPicks: number;
  availableNecromancyPicks: number;
  availableBlackMagicPicks: number;
  isChannellingBoosted: boolean;
  isNecromancyBoosted: boolean;
  blackMagicBoostSigil: 'sinthru' | 'xuth' | null;

  selectedFallenPeaceSigils: Set<string>;
  selectedTelepathy: Set<string>;
  selectedMentalManipulation: Set<string>;
  availableTelepathyPicks: number;
  availableMentalManipulationPicks: number;
  isTelepathyBoosted: boolean;
  isMentalManipulationBoosted: boolean;

  selectedGraciousDefeatSigils: Set<string>;
  selectedEntrance: Set<string>;
  selectedFeatures: Set<string>;
  selectedInfluence: Set<string>;
  availableEntrancePicks: number;
  availableFeaturesPicks: number;
  availableInfluencePicks: number;
  isFeaturesBoosted: boolean;

  selectedClosedCircuitsSigils: Set<string>;
  selectedNetAvatars: Set<string>;
  selectedTechnomancies: Set<string>;
  selectedNaniteControls: Set<string>;
  availableNetAvatarPicks: number;
  availableTechnomancyPicks: number;
  availableNaniteControlPicks: number;
  isTechnomancyBoosted: boolean;
  isNaniteControlBoosted: boolean;

  selectedRighteousCreationSigils: Set<string>;
  selectedSpecialties: Set<string>;
  selectedMagitechPowers: Set<string>;
  selectedArcaneConstructsPowers: Set<string>;
  selectedMetamagicPowers: Set<string>;
  availableSpecialtyPicks: number;
  availableMagitechPicks: number;
  availableArcaneConstructsPicks: number;
  availableMetamagicPicks: number;

  selectedStarCrossedLoveSigils: Set<string>;
  selectedStarCrossedLovePacts: Set<string>;
  availablePactPicks: number;

  selectedLimitlessPotentialRunes: Set<string>;
  customSpells: {
    ruhai: string;
    mialgrath: string;
  };

  selectedAllmillorIds: Set<string>;
  selectedCareerGoalIds: Set<string>;

  selectedColleagueIds: Set<string>;
  customColleagueChoice: string | null;

  selectedRetirementChoiceId: string | null;
  selectedChildOfGodChoiceId: string | null;

  // Actions
  handleSelectDominion: (id: string) => void;
  handleNumParentsChange: (newCount: number) => void;
  handleNumSiblingsChange: (newCount: number) => void;
  handleTraitSelect: (id: string) => void;
  handleUpgradeSelect: (id: string) => void;
  handleTrueSelfTraitSelect: (id: string) => void;
  handleAlterEgoTraitSelect: (id: string) => void;
  handleMagicalStyleSelect: (id: string) => void;
  handleClubSelect: (id: string) => void;
  handleMiscActivitySelect: (id: string) => void;
  handleClassmateSelect: (id: string) => void;
  handleHouseSelect: (id: string) => void;
  handleUniformSelect: (id: string) => void;
  handleBuildTypeSelect: (id: string) => void;
  handleHeadmasterSelect: (id: string) => void;
  handleDurationSelect: (id: string) => void;
  handleBlessingEngravingSelect: (id: string) => void;
  handleTeacherSelect: (id: string) => void;
  handleCommonSigilAction: (id: string, action: 'buy' | 'sell') => void;
  handleLekoluJobAction: (subOptionId: string, action: 'buy' | 'sell') => void;
  handleSpecialSigilChoice: (sigilId: string, subOptionId: string) => void;
  handleToggleBoost: (section: string) => void;
  handleGoodTidingsTierSelect: (id: 'standard' | 'journeyman' | 'master' | null) => void;
  handleEssentialBoonSelect: (id: string) => void;
  handleMinorBoonSelect: (id: string) => void;
  handleMajorBoonSelect: (id: string) => void;
  handleCompellingWillSigilSelect: (id: string) => void;
  handleTelekineticsSelect: (id: string) => void;
  handleMetathermicsSelect: (id: string) => void;
  handleWorldlyWisdomSigilSelect: (id: string) => void;
  handleEleanorsTechniqueSelect: (id: string) => void;
  handleGenevievesTechniqueSelect: (id: string) => void;
  handleBitterDissatisfactionSigilSelect: (id: string) => void;
  handleBrewingSelect: (id: string) => void;
  handleSoulAlchemySelect: (id: string) => void;
  handleTransformationSelect: (id: string) => void;
  handleLostHopeSigilSelect: (id: string) => void;
  handleChannellingSelect: (id: string) => void;
  handleNecromancySelect: (id: string) => void;
  handleBlackMagicSelect: (id: string) => void;
  handleFallenPeaceSigilSelect: (id: string) => void;
  handleTelepathySelect: (id: string) => void;
  handleMentalManipulationSelect: (id: string) => void;
  handleGraciousDefeatSigilSelect: (id: string) => void;
  handleEntranceSelect: (id: string) => void;
  handleFeaturesSelect: (id: string) => void;
  handleInfluenceSelect: (id: string) => void;
  handleClosedCircuitsSigilSelect: (id: string) => void;
  handleNetAvatarSelect: (id: string) => void;
  handleTechnomancySelect: (id: string) => void;
  handleNaniteControlSelect: (id: string) => void;
  handleRighteousCreationSigilSelect: (id: string) => void;
  handleSpecialtySelect: (id: string) => void;
  handleMagitechPowerSelect: (id: string) => void;
  handleArcaneConstructsPowerSelect: (id: string) => void;
  handleMetamagicPowerSelect: (id: string) => void;
  handleStarCrossedLoveSigilSelect: (id: string) => void;
  handleStarCrossedLovePactSelect: (id: string) => void;
  handleLimitlessPotentialRuneSelect: (id: string) => void;
  handleCustomSpellChange: (type: 'ruhai' | 'mialgrath', text: string) => void;
  handleAllmillorSelect: (id: string) => void;
  handleCareerGoalSelect: (id: string) => void;
  handleColleagueSelect: (id: string) => void;
  handleCustomColleagueChoice: (id: string) => void;
  handleRetirementChoiceSelect: (id: string) => void;
  handleChildOfGodChoiceSelect: (id: string) => void;
}

const CharacterContext = createContext<ICharacterContext | undefined>(undefined);

// FIX: Export useCharacterContext hook for components to consume the context.
export const useCharacterContext = () => {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error('useCharacterContext must be used within a CharacterProvider');
    }
    return context;
};

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- STATE MANAGEMENT ---
  const [selectedDominionId, setSelectedDominionId] = useState<string | null>(DOMINIONS[0].id);
  const [blessingPoints, setBlessingPoints] = useState(100);
  const [fortunePoints, setFortunePoints] = useState(100);
  
  // Page 1 State
  const [numParents, setNumParents] = useState(2);
  const [numSiblings, setNumSiblings] = useState(3);
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set());
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [selectedUpgrades, setSelectedUpgrades] = useState<Set<string>>(new Set());
  const [selectedTrueSelfTraits, setSelectedTrueSelfTraits] = useState<Set<string>>(new Set());
  const [selectedAlterEgoTraits, setSelectedAlterEgoTraits] = useState<Set<string>>(new Set());
  const [selectedUniformId, setSelectedUniformId] = useState<string | null>(null);
  const [selectedMagicalStyles, setSelectedMagicalStyles] = useState<Set<string>>(new Set());
  const [selectedBuildTypeId, setSelectedBuildTypeId] = useState<string | null>(null);

  // Page 2 State
  const [selectedHeadmasterId, setSelectedHeadmasterId] = useState<string | null>('competent');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<string>>(new Set());
  const [selectedDurationId, setSelectedDurationId] = useState<string | null>('6_years');
  const [selectedClubIds, setSelectedClubIds] = useState<Set<string>>(new Set());
  const [selectedMiscActivityIds, setSelectedMiscActivityIds] = useState<Set<string>>(new Set());
  const [selectedClassmateIds, setSelectedClassmateIds] = useState<Set<string>>(new Set());

  // Page 3 State
  const [selectedBlessingEngraving, setSelectedBlessingEngraving] = useState<string | null>(null);
  const [acquiredCommonSigils, setAcquiredCommonSigils] = useState<Map<string, number>>(new Map());
  const [acquiredLekoluJobs, setAcquiredLekoluJobs] = useState<Map<string, number>>(new Map());
  const [selectedSpecialSigilChoices, setSelectedSpecialSigilChoices] = useState<Map<string, Set<string>>>(new Map());
  // Good Tidings State
  const [selectedGoodTidingsTier, setSelectedGoodTidingsTier] = useState<'standard' | 'journeyman' | 'master' | null>(null);
  const [selectedEssentialBoons, setSelectedEssentialBoons] = useState<Set<string>>(new Set());
  const [selectedMinorBoons, setSelectedMinorBoons] = useState<Set<string>>(new Set());
  const [selectedMajorBoons, setSelectedMajorBoons] = useState<Set<string>>(new Set());
  const [isMinorBoonsBoosted, setIsMinorBoonsBoosted] = useState(false);
  const [isMajorBoonsBoosted, setIsMajorBoonsBoosted] = useState(false);
  // Compelling Will State
  const [selectedCompellingWillSigils, setSelectedCompellingWillSigils] = useState<Set<string>>(new Set());
  const [selectedTelekinetics, setSelectedTelekinetics] = useState<Set<string>>(new Set());
  const [selectedMetathermics, setSelectedMetathermics] = useState<Set<string>>(new Set());
  const [isTelekineticsBoosted, setIsTelekineticsBoosted] = useState(false);
  const [isMetathermicsBoosted, setIsMetathermicsBoosted] = useState(false);
  // Worldly Wisdom State
  const [selectedWorldlyWisdomSigils, setSelectedWorldlyWisdomSigils] = useState<Set<string>>(new Set());
  const [selectedEleanorsTechniques, setSelectedEleanorsTechniques] = useState<Set<string>>(new Set());
  const [selectedGenevievesTechniques, setSelectedGenevievesTechniques] = useState<Set<string>>(new Set());
  const [isEleanorsTechniquesBoosted, setIsEleanorsTechniquesBoosted] = useState(false);
  const [isGenevievesTechniquesBoosted, setIsGenevievesTechniquesBoosted] = useState(false);
  // Bitter Dissatisfaction State
  const [selectedBitterDissatisfactionSigils, setSelectedBitterDissatisfactionSigils] = useState<Set<string>>(new Set());
  const [selectedBrewing, setSelectedBrewing] = useState<Set<string>>(new Set());
  const [selectedSoulAlchemy, setSelectedSoulAlchemy] = useState<Set<string>>(new Set());
  const [selectedTransformation, setSelectedTransformation] = useState<Set<string>>(new Set());
  const [isBrewingBoosted, setIsBrewingBoosted] = useState(false);
  const [isSoulAlchemyBoosted, setIsSoulAlchemyBoosted] = useState(false);
  const [isTransformationBoosted, setIsTransformationBoosted] = useState(false);
  // Lost Hope State
  const [selectedLostHopeSigils, setSelectedLostHopeSigils] = useState<Set<string>>(new Set());
  const [selectedChannelling, setSelectedChannelling] = useState<Set<string>>(new Set());
  const [selectedNecromancy, setSelectedNecromancy] = useState<Set<string>>(new Set());
  const [selectedBlackMagic, setSelectedBlackMagic] = useState<Set<string>>(new Set());
  const [isChannellingBoosted, setIsChannellingBoosted] = useState(false);
  const [isNecromancyBoosted, setIsNecromancyBoosted] = useState(false);
  const [blackMagicBoostSigil, setBlackMagicBoostSigil] = useState<'sinthru' | 'xuth' | null>(null);
  // Fallen Peace State
  const [selectedFallenPeaceSigils, setSelectedFallenPeaceSigils] = useState<Set<string>>(new Set());
  const [selectedTelepathy, setSelectedTelepathy] = useState<Set<string>>(new Set());
  const [selectedMentalManipulation, setSelectedMentalManipulation] = useState<Set<string>>(new Set());
  const [isTelepathyBoosted, setIsTelepathyBoosted] = useState(false);
  const [isMentalManipulationBoosted, setIsMentalManipulationBoosted] = useState(false);
  // Gracious Defeat State
  const [selectedGraciousDefeatSigils, setSelectedGraciousDefeatSigils] = useState<Set<string>>(new Set());
  const [selectedEntrance, setSelectedEntrance] = useState<Set<string>>(new Set());
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [selectedInfluence, setSelectedInfluence] = useState<Set<string>>(new Set());
  const [isFeaturesBoosted, setIsFeaturesBoosted] = useState(false);
  // Closed Circuits State
  const [selectedClosedCircuitsSigils, setSelectedClosedCircuitsSigils] = useState<Set<string>>(new Set());
  const [selectedNetAvatars, setSelectedNetAvatars] = useState<Set<string>>(new Set());
  const [selectedTechnomancies, setSelectedTechnomancies] = useState<Set<string>>(new Set());
  const [selectedNaniteControls, setSelectedNaniteControls] = useState<Set<string>>(new Set());
  const [isTechnomancyBoosted, setIsTechnomancyBoosted] = useState(false);
  const [isNaniteControlBoosted, setIsNaniteControlBoosted] = useState(false);
  // Righteous Creation State
  const [selectedRighteousCreationSigils, setSelectedRighteousCreationSigils] = useState<Set<string>>(new Set());
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
  const [selectedMagitechPowers, setSelectedMagitechPowers] = useState<Set<string>>(new Set());
  const [selectedArcaneConstructsPowers, setSelectedArcaneConstructsPowers] = useState<Set<string>>(new Set());
  const [selectedMetamagicPowers, setSelectedMetamagicPowers] = useState<Set<string>>(new Set());
  // Star Crossed Love State
  const [selectedStarCrossedLoveSigils, setSelectedStarCrossedLoveSigils] = useState<Set<string>>(new Set());
  const [selectedStarCrossedLovePacts, setSelectedStarCrossedLovePacts] = useState<Set<string>>(new Set());
  // Page 4 State
  const [selectedLimitlessPotentialRunes, setSelectedLimitlessPotentialRunes] = useState<Set<string>>(new Set());
  const [customSpells, setCustomSpells] = useState({ ruhai: '', mialgrath: '' });
  // Page 5 State
  const [selectedAllmillorIds, setSelectedAllmillorIds] = useState<Set<string>>(new Set());
  const [selectedCareerGoalIds, setSelectedCareerGoalIds] = useState<Set<string>>(new Set());
  const [selectedColleagueIds, setSelectedColleagueIds] = useState<Set<string>>(new Set());
  const [customColleagueChoice, setCustomColleagueChoice] = useState<string | null>(null);
  // Page 6 State
  const [selectedRetirementChoiceId, setSelectedRetirementChoiceId] = useState<string | null>(null);
  const [selectedChildOfGodChoiceId, setSelectedChildOfGodChoiceId] = useState<string | null>(null);


    // --- COST CALCULATION ---
    const ALL_CAREER_GOALS = useMemo(() => [
        ...CAREER_GOALS_DATA.proSports,
        ...CAREER_GOALS_DATA.general,
        ...CAREER_GOALS_DATA.finishingTouches
    ], []);

    const lekoluSubOptions = SPECIAL_SIGILS_DATA.find(s => s.id === 'lekolu')?.subOptions || [];

    const ALL_ITEMS_WITH_COSTS = useMemo(() => [
        ...TRAITS_DATA.positive, ...TRAITS_DATA.negative,
        ...HOUSES_DATA, ...HOUSE_UPGRADES_DATA,
        ...TRUE_SELF_TRAITS, ...ALTER_EGO_TRAITS,
        ...MAGICAL_STYLES_DATA, ...BUILD_TYPES_DATA,
        ...HEADMASTERS_DATA, ...TEACHERS_DATA, ...DURATION_DATA,
        ...CLUBS_DATA, ...MISC_ACTIVITIES_DATA, ...CLASSMATES_DATA,
        ...BLESSING_ENGRAVINGS, ...COMMON_SIGILS_DATA, 
        ...SPECIAL_SIGILS_DATA.map(s => ({...s, cost: s.id === 'lekolu' ? '' : s.cost})), // Cost for lekolu is per job
        ...lekoluSubOptions.map(sub => ({...sub, cost: SPECIAL_SIGILS_DATA.find(s => s.id === 'lekolu')?.cost || ''})),
        ...GOOD_TIDINGS_SIGIL_TREE_DATA,
        ...LIMITLESS_POTENTIAL_RUNES_DATA, ...ALLMILLOR_CHOICES_DATA,
        ...ALL_CAREER_GOALS, ...COLLEAGUES_DATA, ...CUSTOM_COLLEAGUE_CHOICES_DATA,
        ...RETIREMENT_CHOICES_DATA, ...CHILD_OF_GOD_DATA,
    ], [ALL_CAREER_GOALS, lekoluSubOptions]);

    const ALL_COSTS = useMemo(() => {
        const costs = new Map<string, Cost>();
        ALL_ITEMS_WITH_COSTS.forEach(item => {
        if (item.id) costs.set(item.id, parseCost(item.cost));
        });
        return costs;
    }, [ALL_ITEMS_WITH_COSTS]);

    const isMultiplayer = selectedBuildTypeId === 'multiplayer';

    // Lock headmaster choice in multiplayer
    useEffect(() => {
        if (isMultiplayer) {
          setSelectedHeadmasterId('competent');
          setSelectedClassmateIds(new Set());
          setSelectedColleagueIds(new Set());
        }
    }, [isMultiplayer]);

    useEffect(() => {
        let totalFpCost = 0;
        let totalBpCost = 0;

        const accumulateCost = (id: string | null) => {
          if (!id) return;
          const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
          totalFpCost += cost.fp;
          totalBpCost += cost.bp;
        };
        
        const dominion = DOMINIONS.find(d => d.id === selectedDominionId);
        const dominionName = dominion?.title.toUpperCase();

        // Page 1
        totalFpCost += PARENT_COST_MAP[numParents] ?? (numParents > 0 ? (numParents - 2) * 5 + 3 : -20);
        totalFpCost += numSiblings * SIBLING_COST_PER;
        selectedTraits.forEach(accumulateCost);
        accumulateCost(selectedHouseId);
        selectedUpgrades.forEach(accumulateCost);
        selectedTrueSelfTraits.forEach(accumulateCost);
        selectedAlterEgoTraits.forEach(accumulateCost);
        selectedMagicalStyles.forEach(accumulateCost);

        // Page 2
        accumulateCost(selectedHeadmasterId);
        selectedTeacherIds.forEach(accumulateCost);
        accumulateCost(selectedDurationId);
        selectedClubIds.forEach(accumulateCost);
        selectedMiscActivityIds.forEach(accumulateCost);
        selectedClassmateIds.forEach(id => {
            const classmate = CLASSMATES_DATA.find(c => c.id === id);
            const cost = ALL_COSTS.get(id) ?? { fp: 0, bp: 0 };
            let currentFpCost = cost.fp;
            if (classmate && dominionName && classmate.birthplace.toUpperCase() === dominionName) {
                if (currentFpCost > 0) currentFpCost = Math.max(0, currentFpCost - 2);
            }
            totalFpCost += currentFpCost;
            totalBpCost += cost.bp;
        });
        
        // Page 3 - Sigils
        accumulateCost(selectedBlessingEngraving);
        
        acquiredCommonSigils.forEach((count, id) => {
            const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
            totalFpCost += cost.fp * count;
            totalBpCost += cost.bp * count;
        });
        
        acquiredLekoluJobs.forEach((count, id) => {
            const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
            totalFpCost += cost.fp * count;
            totalBpCost += cost.bp * count;
        });

        selectedSpecialSigilChoices.forEach((subOptionSet, sigilId) => {
            if (sigilId !== 'lekolu') {
                const cost = ALL_COSTS.get(sigilId) ?? { fp: 0, bp: 0 };
                const count = subOptionSet.size;
                totalFpCost += cost.fp * count;
                totalBpCost += cost.bp * count;
            }
        });
        
        // Page 4
        selectedLimitlessPotentialRunes.forEach(accumulateCost);

        // Page 5
        selectedAllmillorIds.forEach(accumulateCost);
        selectedCareerGoalIds.forEach(accumulateCost);
        selectedColleagueIds.forEach(id => {
            const colleague = COLLEAGUES_DATA.find(c => c.id === id);
            const cost = ALL_COSTS.get(id) ?? { fp: 0, bp: 0 };
            let currentFpCost = cost.fp;
            if (colleague && dominionName && colleague.birthplace.toUpperCase() === dominionName) {
                if (currentFpCost > 0) currentFpCost = Math.max(0, currentFpCost - 2);
            }
            totalFpCost += currentFpCost;
            totalBpCost += cost.bp;
        });
        accumulateCost(customColleagueChoice);
        
        // Page 6
        accumulateCost(selectedRetirementChoiceId);
        accumulateCost(selectedChildOfGodChoiceId);


        setFortunePoints(100 - totalFpCost);
        setBlessingPoints(100 - totalBpCost);
    }, [
        numParents, numSiblings, selectedTraits, selectedHouseId, selectedUpgrades, 
        selectedTrueSelfTraits, selectedAlterEgoTraits, selectedMagicalStyles,
        selectedHeadmasterId, selectedTeacherIds, selectedDurationId, selectedClubIds,
        selectedMiscActivityIds, selectedClassmateIds, selectedBlessingEngraving, 
        acquiredCommonSigils, acquiredLekoluJobs, selectedSpecialSigilChoices, selectedLimitlessPotentialRunes,
        selectedAllmillorIds, selectedCareerGoalIds, selectedColleagueIds, customColleagueChoice,
        selectedRetirementChoiceId, selectedChildOfGodChoiceId,
        selectedDominionId, ALL_COSTS
    ]);

    const getSigilTypeFromImage = (imageSrc: string): keyof ReturnType<typeof useCharacterContext>['availableSigilCounts'] | null => {
        const sigilImageMap: {[key: string]: keyof ReturnType<typeof useCharacterContext>['availableSigilCounts']} = {
            'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas',
            'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu',
        };
        for (const key in sigilImageMap) {
            if (imageSrc.endsWith(key)) {
                return sigilImageMap[key];
            }
        }
        return null;
    }

    // --- SIGIL COUNTING ---
    const totalSigilCounts = useMemo(() => {
        const totals = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        totals.kaarn = acquiredCommonSigils.get('kaarn') ?? 0;
        totals.purth = acquiredCommonSigils.get('purth') ?? 0;
        totals.juathas = acquiredCommonSigils.get('juathas') ?? 0;
        
        totals.xuth = selectedSpecialSigilChoices.get('xuth')?.size ?? 0;
        totals.sinthru = selectedSpecialSigilChoices.get('sinthru')?.size ?? 0;

        let lekoluTotal = 0;
        for (const count of acquiredLekoluJobs.values()) {
            lekoluTotal += count;
        }
        totals.lekolu = lekoluTotal;

        return totals;
    }, [acquiredCommonSigils, selectedSpecialSigilChoices, acquiredLekoluJobs]);

    const usedSigilCounts = useMemo(() => {
        const used = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };

        const countSigilsForTree = (selectedIds: Set<string>, treeData: {id: string, imageSrc: string}[]) => {
            selectedIds.forEach(sigilId => {
                const sigilData = treeData.find(s => s.id === sigilId);
                if (sigilData) {
                    const sigilType = getSigilTypeFromImage(sigilData.imageSrc);
                    if (sigilType) {
                        used[sigilType]++;
                    }
                }
            });
        };
        
        // Good Tidings
        if (selectedGoodTidingsTier) {
            const tierOrder = ['standard', 'journeyman', 'master'];
            const requirements = [{kaarn: 1}, {purth: 1}, {xuth: 1}];
            const currentTierIndex = tierOrder.indexOf(selectedGoodTidingsTier);
            for(let i = 0; i <= currentTierIndex; i++) {
                if(requirements[i].kaarn) used.kaarn += requirements[i].kaarn as number;
                if(requirements[i].purth) used.purth += requirements[i].purth as number;
                if(requirements[i].xuth) used.xuth += requirements[i].xuth as number;
            }
        }
        
        // Other Blessings
        countSigilsForTree(selectedCompellingWillSigils, COMPELLING_WILL_SIGIL_TREE_DATA);
        countSigilsForTree(selectedWorldlyWisdomSigils, WORLDLY_WISDOM_SIGIL_TREE_DATA);
        countSigilsForTree(selectedBitterDissatisfactionSigils, BITTER_DISSATISFACTION_SIGIL_TREE_DATA);
        countSigilsForTree(selectedLostHopeSigils, LOST_HOPE_SIGIL_TREE_DATA);
        countSigilsForTree(selectedFallenPeaceSigils, FALLEN_PEACE_SIGIL_TREE_DATA);
        countSigilsForTree(selectedGraciousDefeatSigils, GRACIOUS_DEFEAT_SIGIL_TREE_DATA);
        countSigilsForTree(selectedClosedCircuitsSigils, CLOSED_CIRCUITS_SIGIL_TREE_DATA);
        countSigilsForTree(selectedRighteousCreationSigils, RIGHTEOUS_CREATION_SIGIL_TREE_DATA);
        countSigilsForTree(selectedStarCrossedLoveSigils, STAR_CROSSED_LOVE_SIGIL_TREE_DATA);

        // Boosts
        if (isMinorBoonsBoosted) used.purth++;
        if (isMajorBoonsBoosted) used.xuth++;
        if (isTelekineticsBoosted) used.kaarn++;
        if (isMetathermicsBoosted) used.purth++;
        if (isEleanorsTechniquesBoosted) used.kaarn++;
        if (isGenevievesTechniquesBoosted) used.purth++;
        if (isBrewingBoosted) used.kaarn++;
        if (isSoulAlchemyBoosted) used.kaarn++;
        if (isTransformationBoosted) used.kaarn++;
        if (isChannellingBoosted) used.kaarn++;
        if (isNecromancyBoosted) used.purth++;
        if (blackMagicBoostSigil === 'sinthru') used.sinthru++;
        if (blackMagicBoostSigil === 'xuth') used.xuth++;
        if (isTelepathyBoosted) used.kaarn++;
        if (isMentalManipulationBoosted) used.purth++;
        if (isFeaturesBoosted) used.kaarn++;
        if (isTechnomancyBoosted) used.kaarn++;
        if (isNaniteControlBoosted) used.purth++;

        return used;
    }, [
        selectedGoodTidingsTier, selectedCompellingWillSigils, selectedWorldlyWisdomSigils,
        selectedBitterDissatisfactionSigils, selectedLostHopeSigils, selectedFallenPeaceSigils,
        selectedGraciousDefeatSigils, selectedClosedCircuitsSigils, selectedRighteousCreationSigils,
        selectedStarCrossedLoveSigils, isMinorBoonsBoosted, isMajorBoonsBoosted,
        isTelekineticsBoosted, isMetathermicsBoosted, isEleanorsTechniquesBoosted, isGenevievesTechniquesBoosted,
        isBrewingBoosted, isSoulAlchemyBoosted, isTransformationBoosted, isChannellingBoosted,
        isNecromancyBoosted, blackMagicBoostSigil, isTelepathyBoosted, isMentalManipulationBoosted,
        isFeaturesBoosted, isTechnomancyBoosted, isNaniteControlBoosted
    ]);
    
    const availableSigilCounts = useMemo(() => ({
        kaarn: totalSigilCounts.kaarn - usedSigilCounts.kaarn,
        purth: totalSigilCounts.purth - usedSigilCounts.purth,
        juathas: totalSigilCounts.juathas - usedSigilCounts.juathas,
        xuth: totalSigilCounts.xuth - usedSigilCounts.xuth,
        sinthru: totalSigilCounts.sinthru - usedSigilCounts.sinthru,
        lekolu: totalSigilCounts.lekolu - usedSigilCounts.lekolu,
    }), [totalSigilCounts, usedSigilCounts]);

    // --- EVENT HANDLERS ---
    const handleSelectDominion = (id: string) => setSelectedDominionId(id);
    const handleNumParentsChange = (newCount: number) => { if (newCount >= 0 && newCount <= 6) setNumParents(newCount); };
    const handleNumSiblingsChange = (newCount: number) => { if (newCount >= 0 && newCount <= 8) setNumSiblings(newCount); };
    
    const createMultiSelectHandler = (state: Set<string>, setState: React.Dispatch<React.SetStateAction<Set<string>>>, max: number = Infinity) => (id: string) => {
        const newSet = new Set(state);
        if (newSet.has(id)) {
        newSet.delete(id);
        } else {
        if (newSet.size < max) newSet.add(id);
        }
        setState(newSet);
    };
    
    const createSingleSelectHandler = (setState: React.Dispatch<React.SetStateAction<string | null>>) => (id: string) => {
        setState(prevId => prevId === id ? null : id);
    }
    
    const handleCommonSigilAction = (id: string, action: 'buy' | 'sell') => {
        setAcquiredCommonSigils(prev => {
// FIX: Add explicit type to new Map to aid TS inference inside setState callback.
            const newMap = new Map<string, number>(prev);
            const currentCount = newMap.get(id) ?? 0;
            if (action === 'buy') {
                newMap.set(id, currentCount + 1);
            } else if (action === 'sell' && currentCount > 0) {
                newMap.set(id, currentCount - 1);
            }
            return newMap;
        });
    };

    const handleLekoluJobAction = (subOptionId: string, action: 'buy' | 'sell') => {
        setAcquiredLekoluJobs(prev => {
// FIX: Add explicit type to new Map to aid TS inference inside setState callback.
            const newMap = new Map<string, number>(prev);
            const currentCount = newMap.get(subOptionId) ?? 0;
            if (action === 'buy') {
                newMap.set(subOptionId, currentCount + 1);
            } else if (action === 'sell' && currentCount > 0) {
                newMap.set(subOptionId, currentCount - 1);
            }
            return newMap;
        });
    };

    const handleSpecialSigilChoice = (sigilId: string, subOptionId: string) => {
        if (sigilId === 'lekolu') return; // Lekolu is handled separately with counts
        setSelectedSpecialSigilChoices(prevMap => {
// FIX: Add explicit type to new Map to aid TS inference inside setState callback.
            const newMap = new Map<string, Set<string>>(prevMap);
            const currentSet = new Set(newMap.get(sigilId) || []);
            if (currentSet.has(subOptionId)) {
                currentSet.delete(subOptionId);
            } else {
                currentSet.add(subOptionId);
            }
            
            if (currentSet.size === 0) {
                newMap.delete(sigilId);
            } else {
                newMap.set(sigilId, currentSet);
            }
            return newMap;
        });
    };

    const handleToggleBoost = (section: string) => {
      const toggle = (isBoosted: boolean, setBoosted: (value: boolean), sigil: keyof typeof availableSigilCounts) => {
        if (isBoosted) setBoosted(false);
        else if (availableSigilCounts[sigil] > 0) setBoosted(true);
      };

      switch (section) {
        case 'minorBoons': toggle(isMinorBoonsBoosted, setIsMinorBoonsBoosted, 'purth'); break;
        case 'majorBoons': toggle(isMajorBoonsBoosted, setIsMajorBoonsBoosted, 'xuth'); break;
        case 'telekinetics': toggle(isTelekineticsBoosted, setIsTelekineticsBoosted, 'kaarn'); break;
        case 'metathermics': toggle(isMetathermicsBoosted, setIsMetathermicsBoosted, 'purth'); break;
        case 'eleanorsTechniques': toggle(isEleanorsTechniquesBoosted, setIsEleanorsTechniquesBoosted, 'kaarn'); break;
        case 'genevievesTechniques': toggle(isGenevievesTechniquesBoosted, setIsGenevievesTechniquesBoosted, 'purth'); break;
        case 'brewing': toggle(isBrewingBoosted, setIsBrewingBoosted, 'kaarn'); break;
        case 'soulAlchemy': toggle(isSoulAlchemyBoosted, setIsSoulAlchemyBoosted, 'kaarn'); break;
        case 'transformation': toggle(isTransformationBoosted, setIsTransformationBoosted, 'kaarn'); break;
        case 'channelling': toggle(isChannellingBoosted, setIsChannellingBoosted, 'kaarn'); break;
        case 'necromancy': toggle(isNecromancyBoosted, setIsNecromancyBoosted, 'purth'); break;
        case 'telepathy': toggle(isTelepathyBoosted, setIsTelepathyBoosted, 'kaarn'); break;
        case 'mentalManipulation': toggle(isMentalManipulationBoosted, setIsMentalManipulationBoosted, 'purth'); break;
        case 'features': toggle(isFeaturesBoosted, setIsFeaturesBoosted, 'kaarn'); break;
        case 'technomancy': toggle(isTechnomancyBoosted, setIsTechnomancyBoosted, 'kaarn'); break;
        case 'naniteControl': toggle(isNaniteControlBoosted, setIsNaniteControlBoosted, 'purth'); break;
        case 'blackMagic':
          if (blackMagicBoostSigil) {
            setBlackMagicBoostSigil(null);
          } else if (availableSigilCounts.sinthru > 0) {
            setBlackMagicBoostSigil('sinthru');
          } else if (availableSigilCounts.xuth > 0) {
            setBlackMagicBoostSigil('xuth');
          }
          break;
        default:
          break;
      }
    };

    const { availableEssentialBoonPicks, availableMinorBoonPicks, availableMajorBoonPicks } = useMemo(() => {
      let essential = 0, minor = 0, major = 0;
      if (selectedGoodTidingsTier) {
          essential = 3;
          if (selectedGoodTidingsTier === 'journeyman' || selectedGoodTidingsTier === 'master') {
              minor = 4;
          }
          if (selectedGoodTidingsTier === 'master') {
              major = 1;
          }
      }
      return { availableEssentialBoonPicks: essential, availableMinorBoonPicks: minor, availableMajorBoonPicks: major };
    }, [selectedGoodTidingsTier]);

    useEffect(() => {
        if (selectedGoodTidingsTier === null) {
            setSelectedEssentialBoons(new Set());
        }
        if (selectedGoodTidingsTier === null || selectedGoodTidingsTier === 'standard') {
            setSelectedMinorBoons(new Set());
        }
        if (selectedGoodTidingsTier !== 'master') {
            setSelectedMajorBoons(new Set());
        }
    }, [selectedGoodTidingsTier]);

    const handleGoodTidingsTierSelect = (id: 'standard' | 'journeyman' | 'master' | null) => {
        const tierOrder: ('standard' | 'journeyman' | 'master')[] = ['standard', 'journeyman', 'master'];
        const prev = selectedGoodTidingsTier;
        
        if (prev === id) { // Deselecting highest tier
            const currentIndex = tierOrder.indexOf(id as 'standard' | 'journeyman' | 'master');
            setSelectedGoodTidingsTier(currentIndex > 0 ? tierOrder[currentIndex - 1] : null);
            return;
        }

        const prevIndex = prev ? tierOrder.indexOf(prev) : -1;
        const newIndex = id ? tierOrder.indexOf(id) : -1;

        if (newIndex < prevIndex) { // Downgrading
            setSelectedGoodTidingsTier(id);
            return;
        }
        
        // Upgrading
        if (id === 'standard' && availableSigilCounts.kaarn < 1) return;
        if (id === 'journeyman' && availableSigilCounts.purth < 1) return;
        if (id === 'master' && availableSigilCounts.xuth < 1) return;

        setSelectedGoodTidingsTier(id);
    };

    const handleEssentialBoonSelect = createMultiSelectHandler(selectedEssentialBoons, setSelectedEssentialBoons, availableEssentialBoonPicks);
    const handleMinorBoonSelect = createMultiSelectHandler(selectedMinorBoons, setSelectedMinorBoons, availableMinorBoonPicks);
    const handleMajorBoonSelect = createMultiSelectHandler(selectedMajorBoons, setSelectedMajorBoons, availableMajorBoonPicks);
    
    const handleCompellingWillSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedCompellingWillSigils);
        const sigil = COMPELLING_WILL_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
        // Deselecting
        const toRemove = new Set<string>();
        const queue = [sigilId];
        toRemove.add(sigilId);
        
        while(queue.length > 0) {
            const currentId = queue.shift()!;
            COMPELLING_WILL_SIGIL_TREE_DATA.forEach(child => {
            if(child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                toRemove.add(child.id);
                queue.push(child.id);
            }
            });
        }
        toRemove.forEach(id => newSelected.delete(id));
        
        // Also deselect powers that require the deselected sigils
        const newTelekinetics = new Set(selectedTelekinetics);
        selectedTelekinetics.forEach(powerId => {
            const power = TELEKINETICS_DATA.find(p => p.id === powerId);
            if (power?.requires?.some(req => toRemove.has(req))) {
                newTelekinetics.delete(powerId);
            }
        });
        setSelectedTelekinetics(newTelekinetics);

        const newMetathermics = new Set(selectedMetathermics);
        selectedMetathermics.forEach(powerId => {
            const power = METATHERMICS_DATA.find(p => p.id === powerId);
            if (power?.requires?.some(req => toRemove.has(req))) {
                newMetathermics.delete(powerId);
            }
        });
        setSelectedMetathermics(newMetathermics);

        } else {
        // Selecting
        const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;

        if (canSelect && hasSigil) {
            newSelected.add(sigilId);
        }
        }
        setSelectedCompellingWillSigils(newSelected);
    };
    
    const { availableTelekineticsPicks, availableMetathermicsPicks } = useMemo(() => {
        let telekinetics = 0;
        let metathermics = 0;
        selectedCompellingWillSigils.forEach(sigilId => {
        const sigil = COMPELLING_WILL_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (sigil) {
            telekinetics += sigil.benefits.telekinetics ?? 0;
            metathermics += sigil.benefits.metathermics ?? 0;
        }
        });
        return { availableTelekineticsPicks: telekinetics, availableMetathermicsPicks: metathermics };
    }, [selectedCompellingWillSigils]);

    const handleTelekineticsSelect = createMultiSelectHandler(selectedTelekinetics, setSelectedTelekinetics, availableTelekineticsPicks);
    const handleMetathermicsSelect = createMultiSelectHandler(selectedMetathermics, setSelectedMetathermics, availableMetathermicsPicks);
  
    const handleWorldlyWisdomSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedWorldlyWisdomSigils);
        const sigil = WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
        // Deselecting
        const toRemove = new Set<string>();
        const queue = [sigilId];
        toRemove.add(sigilId);
        
        while(queue.length > 0) {
            const currentId = queue.shift()!;
            WORLDLY_WISDOM_SIGIL_TREE_DATA.forEach(child => {
            if(child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                toRemove.add(child.id);
                queue.push(child.id);
            }
            });
        }
        toRemove.forEach(id => newSelected.delete(id));
        
        const newEleanors = new Set(selectedEleanorsTechniques);
        selectedEleanorsTechniques.forEach(powerId => {
            const power = ELEANORS_TECHNIQUES_DATA.find(p => p.id === powerId);
            if (power?.requires?.some(req => toRemove.has(req))) {
                newEleanors.delete(powerId);
            }
        });
        setSelectedEleanorsTechniques(newEleanors);

        const newGenevieves = new Set(selectedGenevievesTechniques);
        selectedGenevievesTechniques.forEach(powerId => {
            const power = GENEVIEVES_TECHNIQUES_DATA.find(p => p.id === powerId);
            if (power?.requires?.some(req => toRemove.has(req))) {
                newGenevieves.delete(powerId);
            }
        });
        setSelectedGenevievesTechniques(newGenevieves);

        } else {
            // Selecting
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedWorldlyWisdomSigils(newSelected);
    };

    const { availableEleanorsPicks, availableGenevievesPicks } = useMemo(() => {
        let eleanors = 0;
        let genevieves = 0;
        selectedWorldlyWisdomSigils.forEach(sigilId => {
        const sigil = WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (sigil) {
            eleanors += sigil.benefits.eleanors ?? 0;
            genevieves += sigil.benefits.genevieves ?? 0;
        }
        });
        return { availableEleanorsPicks: eleanors, availableGenevievesPicks: genevieves };
    }, [selectedWorldlyWisdomSigils]);

    const handleEleanorsTechniqueSelect = createMultiSelectHandler(selectedEleanorsTechniques, setSelectedEleanorsTechniques, availableEleanorsPicks);
    const handleGenevievesTechniqueSelect = createMultiSelectHandler(selectedGenevievesTechniques, setSelectedGenevievesTechniques, availableGenevievesPicks);
  
    const handleBitterDissatisfactionSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedBitterDissatisfactionSigils);
        const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                BITTER_DISSATISFACTION_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const createPowerDeselector = (selectedPowers: Set<string>, allPowers: BitterDissatisfactionPower[], setSelectedPowers: React.Dispatch<React.SetStateAction<Set<string>>>) => {
            const newPowers = new Set(selectedPowers);
            selectedPowers.forEach(powerId => {
                const power = allPowers.find(p => p.id === powerId);
                if (power?.requires?.some(req => toRemove.has(req))) {
                    newPowers.delete(powerId);
                }
            });
            setSelectedPowers(newPowers);
            };
            
            createPowerDeselector(selectedBrewing, BREWING_DATA, setSelectedBrewing);
            createPowerDeselector(selectedSoulAlchemy, SOUL_ALCHEMY_DATA, setSelectedSoulAlchemy);
            createPowerDeselector(selectedTransformation, TRANSFORMATION_DATA, setSelectedTransformation);

        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedBitterDissatisfactionSigils(newSelected);
    };

    const { availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks } = useMemo(() => {
        let brewing = 0;
        let soulAlchemy = 0;
        let transformation = 0;
        selectedBitterDissatisfactionSigils.forEach(sigilId => {
            const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                brewing += sigil.benefits.brewing ?? 0;
                soulAlchemy += sigil.benefits.soulAlchemy ?? 0;
                transformation += sigil.benefits.transformation ?? 0;
            }
        });
        return { availableBrewingPicks: brewing, availableSoulAlchemyPicks: soulAlchemy, availableTransformationPicks: transformation };
    }, [selectedBitterDissatisfactionSigils]);
  
    const handleBrewingSelect = createMultiSelectHandler(selectedBrewing, setSelectedBrewing, availableBrewingPicks);
    const handleSoulAlchemySelect = createMultiSelectHandler(selectedSoulAlchemy, setSelectedSoulAlchemy, availableSoulAlchemyPicks);
    const handleTransformationSelect = createMultiSelectHandler(selectedTransformation, setSelectedTransformation, availableTransformationPicks);

    const handleLostHopeSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedLostHopeSigils);
        const sigil = LOST_HOPE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                LOST_HOPE_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const createPowerDeselector = (selectedPowers: Set<string>, allPowers: LostHopePower[], setSelectedPowers: React.Dispatch<React.SetStateAction<Set<string>>>) => {
            const newPowers = new Set(selectedPowers);
            selectedPowers.forEach(powerId => {
                const power = allPowers.find(p => p.id === powerId);
                if (power?.requires?.some(req => toRemove.has(req))) {
                    newPowers.delete(powerId);
                }
            });
            setSelectedPowers(newPowers);
            };
            
            createPowerDeselector(selectedChannelling, CHANNELLING_DATA, setSelectedChannelling);
            createPowerDeselector(selectedNecromancy, NECROMANCY_DATA, setSelectedNecromancy);
            createPowerDeselector(selectedBlackMagic, BLACK_MAGIC_DATA, setSelectedBlackMagic);

        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;
            
            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedLostHopeSigils(newSelected);
    };

    const { availableChannellingPicks, availableNecromancyPicks, availableBlackMagicPicks } = useMemo(() => {
        let channelling = 0;
        let necromancy = 0;
        let blackMagic = 0;
        selectedLostHopeSigils.forEach(sigilId => {
            const sigil = LOST_HOPE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                channelling += sigil.benefits.channeling ?? 0;
                necromancy += sigil.benefits.necromancy ?? 0;
                blackMagic += sigil.benefits.blackMagic ?? 0;
            }
        });
        return { availableChannellingPicks: channelling, availableNecromancyPicks: necromancy, availableBlackMagicPicks: blackMagic };
    }, [selectedLostHopeSigils]);
  
    const handleChannellingSelect = createMultiSelectHandler(selectedChannelling, setSelectedChannelling, availableChannellingPicks);
    const handleNecromancySelect = createMultiSelectHandler(selectedNecromancy, setSelectedNecromancy, availableNecromancyPicks);
    const handleBlackMagicSelect = createMultiSelectHandler(selectedBlackMagic, setSelectedBlackMagic, availableBlackMagicPicks);

    const handleFallenPeaceSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedFallenPeaceSigils);
        const sigil = FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                FALLEN_PEACE_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const createPowerDeselector = (selectedPowers: Set<string>, allPowers: FallenPeacePower[], setSelectedPowers: React.Dispatch<React.SetStateAction<Set<string>>>) => {
            const newPowers = new Set(selectedPowers);
            selectedPowers.forEach(powerId => {
                const power = allPowers.find(p => p.id === powerId);
                if (power?.requires?.some(req => toRemove.has(req))) {
                    newPowers.delete(powerId);
                }
            });
            setSelectedPowers(newPowers);
            };
            
            createPowerDeselector(selectedTelepathy, TELEPATHY_DATA, setSelectedTelepathy);
            createPowerDeselector(selectedMentalManipulation, MENTAL_MANIPULATION_DATA, setSelectedMentalManipulation);

        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedFallenPeaceSigils(newSelected);
    };

    const { availableTelepathyPicks, availableMentalManipulationPicks } = useMemo(() => {
        let telepathy = 0;
        let mentalManipulation = 0;
        selectedFallenPeaceSigils.forEach(sigilId => {
            const sigil = FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                telepathy += sigil.benefits.telepathy ?? 0;
                mentalManipulation += sigil.benefits.mentalManipulation ?? 0;
            }
        });
        return { availableTelepathyPicks: telepathy, availableMentalManipulationPicks: mentalManipulation };
    }, [selectedFallenPeaceSigils]);

    const handleTelepathySelect = createMultiSelectHandler(selectedTelepathy, setSelectedTelepathy, availableTelepathyPicks);
    const handleMentalManipulationSelect = createMultiSelectHandler(selectedMentalManipulation, setSelectedMentalManipulation, availableMentalManipulationPicks);
  
    const handleGraciousDefeatSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedGraciousDefeatSigils);
        const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                GRACIOUS_DEFEAT_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const createPowerDeselector = (selectedPowers: Set<string>, allPowers: GraciousDefeatPower[], setSelectedPowers: React.Dispatch<React.SetStateAction<Set<string>>>) => {
              const newPowers = new Set(selectedPowers);
              selectedPowers.forEach(powerId => {
                  const power = allPowers.find(p => p.id === powerId);
                  if (power?.requires?.some(req => toRemove.has(req))) {
                      newPowers.delete(powerId);
                  }
              });
              setSelectedPowers(newPowers);
            };

            createPowerDeselector(selectedEntrance, ENTRANCE_DATA, setSelectedEntrance);
            createPowerDeselector(selectedFeatures, FEATURES_DATA, setSelectedFeatures);
            createPowerDeselector(selectedInfluence, INFLUENCE_DATA, setSelectedInfluence);

        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedGraciousDefeatSigils(newSelected);
    };

    const { availableEntrancePicks, availableFeaturesPicks, availableInfluencePicks } = useMemo(() => {
      let entrance = 0;
      let features = 0;
      let influence = 0;
      selectedGraciousDefeatSigils.forEach(sigilId => {
          const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === sigilId);
          if (sigil) {
              entrance += sigil.benefits.entrance ?? 0;
              features += sigil.benefits.features ?? 0;
              influence += sigil.benefits.influence ?? 0;
          }
      });
      return { availableEntrancePicks: entrance, availableFeaturesPicks: features, availableInfluencePicks: influence };
    }, [selectedGraciousDefeatSigils]);

    const handleEntranceSelect = createMultiSelectHandler(selectedEntrance, setSelectedEntrance, availableEntrancePicks);
    const handleFeaturesSelect = createMultiSelectHandler(selectedFeatures, setSelectedFeatures, availableFeaturesPicks);
    const handleInfluenceSelect = createMultiSelectHandler(selectedInfluence, setSelectedInfluence, availableInfluencePicks);

    const handleClosedCircuitsSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedClosedCircuitsSigils);
        const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                CLOSED_CIRCUITS_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const createPowerDeselector = (selectedPowers: Set<string>, allPowers: ClosedCircuitsPower[], setSelectedPowers: React.Dispatch<React.SetStateAction<Set<string>>>) => {
                const newPowers = new Set(selectedPowers);
                selectedPowers.forEach(powerId => {
                    const power = allPowers.find(p => p.id === powerId);
                    if (power?.requires?.some(req => toRemove.has(req))) {
                        newPowers.delete(powerId);
                    }
                });
                setSelectedPowers(newPowers);
            };
            
            createPowerDeselector(selectedNetAvatars, NET_AVATAR_DATA, setSelectedNetAvatars);
            createPowerDeselector(selectedTechnomancies, TECHNOMANCY_DATA, setSelectedTechnomancies);
            createPowerDeselector(selectedNaniteControls, NANITE_CONTROL_DATA, setSelectedNaniteControls);
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedClosedCircuitsSigils(newSelected);
    };

    const { availableNetAvatarPicks, availableTechnomancyPicks, availableNaniteControlPicks } = useMemo(() => {
        let netAvatar = 0;
        let technomancy = 0;
        let naniteControl = 0;
        selectedClosedCircuitsSigils.forEach(sigilId => {
            const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                netAvatar += sigil.benefits.netAvatar ?? 0;
                technomancy += sigil.benefits.technomancy ?? 0;
                naniteControl += sigil.benefits.naniteControl ?? 0;
            }
        });
        return { availableNetAvatarPicks: netAvatar, availableTechnomancyPicks: technomancy, availableNaniteControlPicks: naniteControl };
    }, [selectedClosedCircuitsSigils]);

    const handleNetAvatarSelect = createMultiSelectHandler(selectedNetAvatars, setSelectedNetAvatars, availableNetAvatarPicks);
    const handleTechnomancySelect = createMultiSelectHandler(selectedTechnomancies, setSelectedTechnomancies, availableTechnomancyPicks);
    const handleNaniteControlSelect = createMultiSelectHandler(selectedNaniteControls, setSelectedNaniteControls, availableNaniteControlPicks);

    const handleRighteousCreationSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedRighteousCreationSigils);
        const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                RIGHTEOUS_CREATION_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const createPowerDeselector = (selectedPowers: Set<string>, allPowers: RighteousCreationPower[], setSelectedPowers: React.Dispatch<React.SetStateAction<Set<string>>>) => {
                const newPowers = new Set(selectedPowers);
                selectedPowers.forEach(powerId => {
                    const power = allPowers.find(p => p.id === powerId);
                    if (power?.requires?.some(req => toRemove.has(req))) {
                        newPowers.delete(powerId);
                    }
                });
                setSelectedPowers(newPowers);
            };
            
            createPowerDeselector(selectedMagitechPowers, RIGHTEOUS_CREATION_MAGITECH_DATA, setSelectedMagitechPowers);
            createPowerDeselector(selectedArcaneConstructsPowers, RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, setSelectedArcaneConstructsPowers);
            createPowerDeselector(selectedMetamagicPowers, RIGHTEOUS_CREATION_METAMAGIC_DATA, setSelectedMetamagicPowers);

        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedRighteousCreationSigils(newSelected);
    };
    
    const { availableSpecialtyPicks, availableMagitechPicks, availableArcaneConstructsPicks, availableMetamagicPicks } = useMemo(() => {
        let specialty = 0;
        let magitech = 0;
        let arcaneConstructs = 0;
        let metamagic = 0;
        selectedRighteousCreationSigils.forEach(sigilId => {
            const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                specialty += sigil.benefits.specialty ?? 0;
                magitech += sigil.benefits.magitech ?? 0;
                arcaneConstructs += sigil.benefits.arcaneConstructs ?? 0;
                metamagic += sigil.benefits.metamagic ?? 0;
            }
        });
        return { availableSpecialtyPicks: specialty, availableMagitechPicks: magitech, availableArcaneConstructsPicks: arcaneConstructs, availableMetamagicPicks: metamagic };
    }, [selectedRighteousCreationSigils]);
    
    const handleSpecialtySelect = createMultiSelectHandler(selectedSpecialties, setSelectedSpecialties, availableSpecialtyPicks);
    const handleMagitechPowerSelect = createMultiSelectHandler(selectedMagitechPowers, setSelectedMagitechPowers, availableMagitechPicks);
    const handleArcaneConstructsPowerSelect = createMultiSelectHandler(selectedArcaneConstructsPowers, setSelectedArcaneConstructsPowers, availableArcaneConstructsPicks);
    const handleMetamagicPowerSelect = createMultiSelectHandler(selectedMetamagicPowers, setSelectedMetamagicPowers, availableMetamagicPicks);

    const handleStarCrossedLoveSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedStarCrossedLoveSigils);
        const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            newSelected.delete(sigilId);
        } else {
            if (newSelected.size < 2) { // Max 2
                const sigilType = getSigilTypeFromImage(sigil.imageSrc);
                const hasSigil = sigilType ? availableSigilCounts[sigilType] > 0 : true;
                if (hasSigil) {
                    newSelected.add(sigilId);
                }
            }
        }
        setSelectedStarCrossedLoveSigils(newSelected);
    };

    const { availablePactPicks } = useMemo(() => {
        let pacts = 0;
        selectedStarCrossedLoveSigils.forEach(sigilId => {
            const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                pacts += sigil.benefits.pacts ?? 0;
            }
        });
        return { availablePactPicks: pacts };
    }, [selectedStarCrossedLoveSigils]);

    const handleStarCrossedLovePactSelect = createMultiSelectHandler(selectedStarCrossedLovePacts, setSelectedStarCrossedLovePacts, availablePactPicks);

    const handleLimitlessPotentialRuneSelect = createMultiSelectHandler(selectedLimitlessPotentialRunes, setSelectedLimitlessPotentialRunes);
    const handleCustomSpellChange = (type: 'ruhai' | 'mialgrath', text: string) => {
        setCustomSpells(prev => ({ ...prev, [type]: text }));
    };

    const handleAllmillorSelect = createMultiSelectHandler(selectedAllmillorIds, setSelectedAllmillorIds, 3);
    const handleCareerGoalSelect = createMultiSelectHandler(selectedCareerGoalIds, setSelectedCareerGoalIds);
    const handleColleagueSelect = createMultiSelectHandler(selectedColleagueIds, setSelectedColleagueIds);
    const handleCustomColleagueChoice = createSingleSelectHandler(setCustomColleagueChoice);

    const handleRetirementChoiceSelect = createSingleSelectHandler(setSelectedRetirementChoiceId);
    const handleChildOfGodChoiceSelect = createSingleSelectHandler(setSelectedChildOfGodChoiceId);

    const handleTraitSelect = createMultiSelectHandler(selectedTraits, setSelectedTraits);
    const handleUpgradeSelect = createMultiSelectHandler(selectedUpgrades, setSelectedUpgrades);
    const handleTrueSelfTraitSelect = createMultiSelectHandler(selectedTrueSelfTraits, setSelectedTrueSelfTraits);
    const handleAlterEgoTraitSelect = createMultiSelectHandler(selectedAlterEgoTraits, setSelectedAlterEgoTraits);
    const handleMagicalStyleSelect = createMultiSelectHandler(selectedMagicalStyles, setSelectedMagicalStyles);
    const handleClubSelect = createMultiSelectHandler(selectedClubIds, setSelectedClubIds);
    const handleMiscActivitySelect = createMultiSelectHandler(selectedMiscActivityIds, setSelectedMiscActivityIds);
    const handleClassmateSelect = createMultiSelectHandler(selectedClassmateIds, setSelectedClassmateIds);
    const handleTeacherSelect = createMultiSelectHandler(selectedTeacherIds, setSelectedTeacherIds, 5);

    const handleHouseSelect = createSingleSelectHandler(setSelectedHouseId);
    const handleUniformSelect = createSingleSelectHandler(setSelectedUniformId);
    const handleBuildTypeSelect = createSingleSelectHandler(setSelectedBuildTypeId);
    const handleHeadmasterSelect = createSingleSelectHandler(setSelectedHeadmasterId);
    const handleDurationSelect = createSingleSelectHandler(setSelectedDurationId);
    const handleBlessingEngravingSelect = createSingleSelectHandler(setSelectedBlessingEngraving);

    const contextValue: ICharacterContext = {
      selectedDominionId, blessingPoints, fortunePoints, numParents, numSiblings, selectedTraits, selectedHouseId, selectedUpgrades, selectedTrueSelfTraits, selectedAlterEgoTraits, selectedUniformId, selectedMagicalStyles, selectedBuildTypeId, selectedHeadmasterId, selectedTeacherIds, selectedDurationId, selectedClubIds, selectedMiscActivityIds, selectedClassmateIds, selectedBlessingEngraving, isMultiplayer, 
      acquiredCommonSigils, acquiredLekoluJobs, selectedSpecialSigilChoices, availableSigilCounts, totalSigilCounts,
      selectedGoodTidingsTier, selectedEssentialBoons, selectedMinorBoons, selectedMajorBoons, availableEssentialBoonPicks, availableMinorBoonPicks, availableMajorBoonPicks, isMinorBoonsBoosted, isMajorBoonsBoosted,
      selectedCompellingWillSigils, selectedTelekinetics, selectedMetathermics, availableTelekineticsPicks, availableMetathermicsPicks, isTelekineticsBoosted, isMetathermicsBoosted,
      selectedWorldlyWisdomSigils, selectedEleanorsTechniques, selectedGenevievesTechniques, availableEleanorsPicks, availableGenevievesPicks, isEleanorsTechniquesBoosted, isGenevievesTechniquesBoosted,
      selectedBitterDissatisfactionSigils, selectedBrewing, selectedSoulAlchemy, selectedTransformation, availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks, isBrewingBoosted, isSoulAlchemyBoosted, isTransformationBoosted,
      selectedLostHopeSigils, selectedChannelling, selectedNecromancy, selectedBlackMagic, availableChannellingPicks, availableNecromancyPicks, availableBlackMagicPicks, isChannellingBoosted, isNecromancyBoosted, blackMagicBoostSigil,
      selectedFallenPeaceSigils, selectedTelepathy, selectedMentalManipulation, availableTelepathyPicks, availableMentalManipulationPicks, isTelepathyBoosted, isMentalManipulationBoosted,
      selectedGraciousDefeatSigils, selectedEntrance, selectedFeatures, selectedInfluence, availableEntrancePicks, availableFeaturesPicks, availableInfluencePicks, isFeaturesBoosted,
      selectedClosedCircuitsSigils, selectedNetAvatars, selectedTechnomancies, selectedNaniteControls, availableNetAvatarPicks, availableTechnomancyPicks, availableNaniteControlPicks, isTechnomancyBoosted, isNaniteControlBoosted,
      selectedRighteousCreationSigils, selectedSpecialties, selectedMagitechPowers, selectedArcaneConstructsPowers, selectedMetamagicPowers, availableSpecialtyPicks, availableMagitechPicks, availableArcaneConstructsPicks, availableMetamagicPicks, 
      selectedStarCrossedLoveSigils, selectedStarCrossedLovePacts, availablePactPicks, 
      selectedLimitlessPotentialRunes, customSpells, selectedAllmillorIds, selectedCareerGoalIds, selectedColleagueIds, customColleagueChoice, selectedRetirementChoiceId, selectedChildOfGodChoiceId,
      handleSelectDominion, handleNumParentsChange, handleNumSiblingsChange, handleTraitSelect, handleUpgradeSelect, handleTrueSelfTraitSelect, handleAlterEgoTraitSelect, handleMagicalStyleSelect, handleClubSelect, handleMiscActivitySelect, handleClassmateSelect, handleHouseSelect, handleUniformSelect, handleBuildTypeSelect, handleHeadmasterSelect, handleDurationSelect, handleBlessingEngravingSelect, handleTeacherSelect, handleCommonSigilAction, handleLekoluJobAction, handleSpecialSigilChoice, handleToggleBoost, handleGoodTidingsTierSelect, handleEssentialBoonSelect, handleMinorBoonSelect, handleMajorBoonSelect, handleCompellingWillSigilSelect, handleTelekineticsSelect, handleMetathermicsSelect, handleWorldlyWisdomSigilSelect, handleEleanorsTechniqueSelect, handleGenevievesTechniqueSelect, handleBitterDissatisfactionSigilSelect, handleBrewingSelect, handleSoulAlchemySelect, handleTransformationSelect, handleLostHopeSigilSelect, handleChannellingSelect, handleNecromancySelect, handleBlackMagicSelect, handleFallenPeaceSigilSelect, handleTelepathySelect, handleMentalManipulationSelect, handleGraciousDefeatSigilSelect, handleEntranceSelect, handleFeaturesSelect, handleInfluenceSelect, handleClosedCircuitsSigilSelect, handleNetAvatarSelect, handleTechnomancySelect, handleNaniteControlSelect, handleRighteousCreationSigilSelect, handleSpecialtySelect, handleMagitechPowerSelect, handleArcaneConstructsPowerSelect, handleMetamagicPowerSelect, handleStarCrossedLoveSigilSelect, handleStarCrossedLovePactSelect, handleLimitlessPotentialRuneSelect, handleCustomSpellChange, handleAllmillorSelect, handleCareerGoalSelect, handleColleagueSelect, handleCustomColleagueChoice, handleRetirementChoiceSelect, handleChildOfGodChoiceSelect
    };

    // FIX: CharacterProvider was not returning anything. It should return the provider with the context value.
    return (
        <CharacterContext.Provider value={contextValue}>
            {children}
        </CharacterContext.Provider>
    );
};