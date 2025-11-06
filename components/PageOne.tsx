import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
  DOMINIONS, TRAITS_DATA, HOUSES_DATA, HOUSE_UPGRADES_DATA,
  TRUE_SELF_TRAITS, ALTER_EGO_TRAITS, UNIFORMS_DATA, MAGICAL_STYLES_DATA,
  BUILD_TYPES_DATA
} from '../constants';
import type { Dominion } from '../types';
import { DominionCard } from './DominionCard';
import { PointCard } from './PointCard';
import { ChoiceCard } from './TraitCard';
import { SectionHeader, SectionSubHeader } from './ui';

export const PageOne: React.FC = () => {
    const {
        selectedDominionId, blessingPoints, fortunePoints,
        numParents, numSiblings, selectedTraits, selectedHouseId,
        selectedUpgrades, selectedTrueSelfTraits, selectedAlterEgoTraits,
        selectedUniformId, selectedMagicalStyles, selectedBuildTypeId,
        handleSelectDominion, handleNumParentsChange, handleNumSiblingsChange,
        handleTraitSelect, handleHouseSelect, handleUpgradeSelect,
        handleTrueSelfTraitSelect, handleAlterEgoTraitSelect,
        handleUniformSelect, handleMagicalStyleSelect, handleBuildTypeSelect
    } = useCharacterContext();

    return (
        <>
        {/* Stage I: Your Birth Section */}
        <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16">
            <div className="flex-shrink-0 relative">
            <img 
                src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/main2.png" 
                alt="Yasmin, the guide" 
                className="w-96 md:w-[36rem]"
            />
            </div>
            <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-2xl font-cinzel tracking-widest text-gray-400">STAGE I</h2>
            <h1 className="text-5xl font-bold font-cinzel my-2 text-white">YOUR BIRTH</h1>
            <hr className="border-gray-600 my-4" />
            <div className="text-gray-300 leading-relaxed mb-6 space-y-4">
                <p>Today, the Theosis Festival parades through the streets, celebrating the 500th anniversary of the day mankind finally ascended the Tower of Babel, and killed God.</p>
                <p>Everyone knows what that means; the eagerly awaited annual birth of more mages, a few for every Dominion in the land! Millions of people travel miles to their respective capitals to witness these historic events. Leading the crowd is a strange, small girl with a cloak that glows with all the stars of the night sky. She is Yasmin, one of the countless mages that make up all the movers and shakers of this fractured verse. “Come one, come all! The ceremony is about to begin — and this is one you won’t want to miss! The Mother tells me a few special mages are going to be born this year. That’s right; in her infinite generosity, the Mother is bequeathing unto us a few mages far more powerful than the standard this year. All part of her grand plan for all mankind, I’m sure,” Yasmin cheers. Most of the crowd simply oos and aas. A few, the wiser among them, grimace nervously, knowing such drastic measures imply the Mother must be becoming truly desperate. “I wonder if one of them will be born right here? There’s only one way to find out. Oooo, look, it’s starting!”</p>
                <p>The crowd gathers closely around that swirling blue vortex, beholding in awe as the Mother of Azure guides the universe’s hand in the miraculous creation of life…</p>
            </div>
            <img 
                src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/main3.png" 
                alt="Swirling blue vortex" 
                className="rounded-lg shadow-lg shadow-blue-500/20 w-full max-w-lg mx-auto lg:mx-0" 
            />
            </div>
        </section>

        {/* Dominion Choice Section */}
        <section className="my-16">
            <SectionHeader>Choose the Dominion in which you shall be reborn</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOMINIONS.map((dominion: Dominion) => (
                <DominionCard
                key={dominion.id}
                dominion={dominion}
                isSelected={selectedDominionId === dominion.id}
                onSelect={handleSelectDominion}
                />
            ))}
            </div>
        </section>
        
        {/* Points & Intro Section */}
        <section className="mt-24 text-center max-w-7xl mx-auto">
            <hr className="border-gray-700 mb-8" />
            <p className="text-gray-400 italic leading-relaxed mb-12 max-w-4xl mx-auto">
            Earth, as it's been since the end of the Forsaken Age, is an utopia...
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <PointCard amount={blessingPoints} pointName="BLESSING POINTS (BP)" description="for use on Stolen Blessings, enchantments, and other magical boons" color="purple" title="You start with" />
                <PointCard amount={fortunePoints} pointName="FORTUNE POINTS (FP)" description="for use on friends, opportunities, strokes of luck, and other material comforts" color="green" title="You start with" />
            </div>
            <p className="text-gray-500 mt-6 text-sm">
            Try not to spend too many of them on just one page! You will need them for future pages.
            </p>
        </section>

        {/* Foster Family Section */}
        <section className="my-16 max-w-7xl mx-auto">
            <SectionHeader>Design the foster family that has been selected to raise you</SectionHeader>
            <div className="flex flex-col md:flex-row justify-center items-start gap-12 lg:gap-24 mb-12">
            {/* Parents Selector */}
            <div className="flex flex-col items-center flex-1">
                <div className="flex justify-center items-center gap-4 mb-4 min-h-[128px]">
                {Array.from({ length: numParents }).map((_, i) => ( <img key={`parent-${i}`} src={`https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/parent1.png`} alt={`Parent ${i+1}`} className="rounded-full w-32 h-32 object-cover"/> ))}
                </div>
                <h3 className="font-cinzel text-xl font-bold mt-6 tracking-wider">PARENTS</h3>
                <div className="flex items-center justify-center gap-4 my-2 text-white">
                <button onClick={() => handleNumParentsChange(numParents - 1)} disabled={numParents === 0} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">-</button>
                <span className="text-xl font-semibold w-10 text-center">{numParents}</span>
                <button onClick={() => handleNumParentsChange(numParents + 1)} disabled={numParents === 6} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">+</button>
                </div>
                <div className="text-sm text-gray-400 text-center mt-2 max-w-xs bg-black/20 p-4 rounded-lg border border-gray-800">
                <p>Having 0 parents grants <span className="text-green-400 font-semibold">+20 FP</span>.</p>
                <p>Having 1 parent grants <span className="text-green-400 font-semibold">+10 FP</span>.</p>
                <p>Having 2 parents costs <span className="text-gray-300 font-semibold">0 FP</span>.</p>
                <p>And so on...</p>
                <hr className="border-gray-700 my-2" />
                <p className="italic text-xs">With each you purchased, you decide if they're a mother or father.</p>
                </div>
            </div>
            {/* Siblings Selector */}
            <div className="flex flex-col items-center flex-1">
                <div className="flex justify-center items-center gap-4 mb-4 min-h-[128px]">
                {Array.from({ length: numSiblings }).map((_, i) => ( <img key={`sibling-${i}`} src={`https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/sib1.png`} alt={`Sibling ${i+1}`} className="rounded-full w-32 h-32 object-cover"/> ))}
                </div>
                <h3 className="font-cinzel text-xl font-bold mt-6 tracking-wider">SIBLINGS</h3>
                <div className="flex items-center justify-center gap-4 my-2 text-white">
                <button onClick={() => handleNumSiblingsChange(numSiblings - 1)} disabled={numSiblings === 0} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">-</button>
                <span className="text-xl font-semibold w-10 text-center">{numSiblings}</span>
                <button onClick={() => handleNumSiblingsChange(numSiblings + 1)} disabled={numSiblings === 8} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">+</button>
                </div>
                <div className="text-sm text-gray-400 text-center mt-2 max-w-xs bg-black/20 p-4 rounded-lg border border-gray-800">
                <p>Having 0 siblings costs <span className="text-gray-300 font-semibold">0 FP</span>.</p>
                <p>Having 1 sibling costs <span className="text-red-400 font-semibold">-3 FP</span>.</p>
                <p>And so on...</p>
                <hr className="border-gray-700 my-2" />
                <p className="italic text-xs">With each you purchased, you decide if they're a brother or sister, and if you're older, younger, or twins.</p>
                </div>
            </div>
            </div>
            <SectionSubHeader>Each family member will be kind of average and generic by default, but you can buy Traits for each of them. You can only take each negative trait (those that grant FP) once total.</SectionSubHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...TRAITS_DATA.positive, ...TRAITS_DATA.negative].map(trait => (
                <ChoiceCard key={trait.id} item={trait} isSelected={selectedTraits.has(trait.id)} onSelect={handleTraitSelect} layout="horizontal" imageShape="rect" />
            ))}
            </div>
        </section>

        {/* House Section */}
        <section className="my-16">
            <SectionSubHeader>What kind of house does your family own? Your default house will be in your Dominion of birth, but you can also buy extra Vacation Homes in any dominion you choose, for -3 FP each.</SectionSubHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {HOUSES_DATA.map(house => (
                    <ChoiceCard key={house.id} item={house} isSelected={selectedHouseId === house.id} onSelect={handleHouseSelect} />
                ))}
            </div>
        </section>

        {/* House Upgrades Section */}
        <section className="my-16">
            <SectionSubHeader>And just like buying traits for your family, you can buy Upgrades for your houses! The same rules apply.</SectionSubHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {HOUSE_UPGRADES_DATA.map(upgrade => (
                    <ChoiceCard key={upgrade.id} item={upgrade} isSelected={selectedUpgrades.has(upgrade.id)} onSelect={handleUpgradeSelect} />
                ))}
            </div>
        </section>

        {/* Alter Ego Section */}
        <section className="my-16">
            <SectionHeader>Design yourself and your Alter Ego</SectionHeader>

            <div className="flex flex-col items-center text-center">
            <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/main4.jpg" alt="Alter Ego concept"
                className="rounded-full w-64 h-64 object-cover border-4 border-gray-700 shadow-lg mb-8" />
            <p className="max-w-4xl mx-auto text-gray-300 leading-relaxed">
                In around the 2000's, the Magus councils and secret societies began to rethink the raising of Mages...
            </p>
            </div>

            <SectionSubHeader>Here, you can purchase traits for your True Self.</SectionSubHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUE_SELF_TRAITS.map(trait => (
                <ChoiceCard key={trait.id} item={trait} isSelected={selectedTrueSelfTraits.has(trait.id)} onSelect={handleTrueSelfTraitSelect} />
            ))}
            </div>

            <SectionSubHeader>Here, you can purchase traits for your Alter Ego.</SectionSubHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALTER_EGO_TRAITS.map(trait => (
                <ChoiceCard key={trait.id} item={trait} isSelected={selectedAlterEgoTraits.has(trait.id)} onSelect={handleAlterEgoTraitSelect} />
            ))}
            </div>
        </section>

        {/* Uniform Section */}
        <section className="my-16">
            <SectionSubHeader>Your Alter Ego will also need a distinctive uniform! Choose one for free. You can also buy extras for -1 FP each.</SectionSubHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {UNIFORMS_DATA.map(uniform => (
                    <ChoiceCard 
                        key={uniform.id} 
                        item={uniform} 
                        isSelected={selectedUniformId === uniform.id} 
                        onSelect={handleUniformSelect}
                        layout="horizontal-tall"
                    />
                ))}
            </div>
        </section>
        
        {/* Magical Style Section */}
        <section className="my-16">
            <SectionSubHeader>You can also choose your Magical Style! This is a purely visual upgrade applied to your spells... Note: this is not the same thing as having control over an element, it's purely visual.</SectionSubHeader>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                {MAGICAL_STYLES_DATA.map(style => (
                    <ChoiceCard 
                        key={style.id} 
                        item={style} 
                        isSelected={selectedMagicalStyles.has(style.id)} 
                        onSelect={handleMagicalStyleSelect}
                        aspect="square"
                    />
                ))}
            </div>
        </section>

        {/* Build Type Section */}
        <section className="my-16">
            <SectionHeader>Select the kind of build you desire</SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {BUILD_TYPES_DATA.map(build => (
                    <ChoiceCard key={build.id} item={build} isSelected={selectedBuildTypeId === build.id} onSelect={handleBuildTypeSelect} />
                ))}
            </div>
        </section>
        </>
    )
}