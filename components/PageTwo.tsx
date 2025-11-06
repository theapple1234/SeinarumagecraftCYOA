import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import {
    SCHOOLS_DATA, HEADMASTERS_DATA, TEACHERS_DATA,
    DURATION_DATA, CLUBS_DATA, MISC_ACTIVITIES_DATA, CLASSMATES_DATA,
    DOMINIONS
} from '../constants';
import { ChoiceCard } from './TraitCard';
import { ClassmateCard } from './ClassmateCard';
import { SectionHeader, SectionSubHeader } from './ui';

export const PageTwo: React.FC = () => {
    const {
        selectedDominionId, isMultiplayer,
        selectedHeadmasterId, handleHeadmasterSelect,
        selectedTeacherIds, handleTeacherSelect,
        selectedDurationId, handleDurationSelect,
        selectedClubIds, handleClubSelect,
        selectedMiscActivityIds, handleMiscActivitySelect,
        selectedClassmateIds, handleClassmateSelect,
    } = useCharacterContext();

    const userSchoolKey = selectedDominionId || 'halidew'; // Default to halidew if nothing is selected
    const userSchool = SCHOOLS_DATA[userSchoolKey];
    
    const topClubs = CLUBS_DATA.slice(0, 3);
    const otherClubs = CLUBS_DATA.slice(3);

    const getAdjustedCost = (classmate: { cost: string, birthplace: string }): string => {
        const dominion = DOMINIONS.find(d => d.id === selectedDominionId);
        if (dominion && classmate.birthplace.toUpperCase() === dominion.title.toUpperCase()) {
            const costMatch = classmate.cost.match(/Costs -(\d+)\s*FP/i);
            if (costMatch) {
                const originalCost = parseInt(costMatch[1], 10);
                const newCost = Math.max(0, originalCost - 2);
                return newCost > 0 ? `Costs -${newCost} FP` : 'Costs 0 FP';
            }
        }
        return classmate.cost;
    };

    return (
        <>
            {/* Stage II: Your Schooling Section */}
            <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16">
                <div className="flex-shrink-0 relative">
                    <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg2/main2.png" alt="Student" className="w-80 md:w-96 rounded-full border-4 border-gray-700" />
                </div>
                <div className="max-w-2xl text-center lg:text-left">
                    <h2 className="text-2xl font-cinzel tracking-widest text-gray-400">STAGE II</h2>
                    <h1 className="text-5xl font-bold font-cinzel my-2 text-white">YOUR SCHOOLING</h1>
                    <hr className="border-gray-600 my-4" />
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Mundane school is notoriously dull. You remember how your old history teacher used to prattle on in monotone for what felt like hours. "Really, we should have known from the very beginning," you vaguely remember from one of his many lectures. "Since simulations can be vested within other simulations limitlessly, the cardinality of the set of all simulations exceeds that of the set of all natural numbers. In other words, 'real' universes, even assuming the multiverse is unlimited, are infinitely outnumbered by simulated universes. Therefore, it was always a statistical certainty that the world we are living in isn't 'real', so to speak. In fact, it's just as certain that the universe simulating ours is, itself, simulated..." You were so bored, all you could focus on was counting the flecks of grey in his beard.
                        <br/><br/>
                        Fortunately, most of the things that would ordinarily require blunt memorization were instead magically transmitted directly into your mind. Therefore, by the time you were roughly ten, you already had the knowledge of a college grad (by real world standards). Thus began your real education: your assignment to your Dominion's prestigious school of magecraft! The studying you're doing here will define your future career, but don't get too stressed out. Graduation rates are near 100%, and enrollment is free, allowing you to take as much time as you need to accomplish your goals: many students have been here for decades!
                    </p>
                    <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg2/main3.png" alt="Classroom" className="rounded-lg shadow-lg shadow-orange-500/10 w-full max-w-md mx-auto lg:mx-0" />
                </div>
            </section>

            {/* School Display Section */}
            <section className="my-16">
                <SectionSubHeader>First thing's first: the mage school you end up going to depends on the Dominion in which you were born.</SectionSubHeader>
                {userSchool ? (
                    <div className="flex justify-center p-4">
                        <div className="bg-[#4a2e1d]/80 border-2 border-yellow-700 ring-4 ring-yellow-700/30 rounded-lg p-6 flex flex-col transition-all duration-300 max-w-xl mx-auto shadow-2xl shadow-yellow-700/10">
                            <img src={userSchool.imageSrc} alt={userSchool.title} className="w-full h-64 object-cover rounded-md mb-6" />
                            <h4 className="font-bold text-2xl font-cinzel text-white text-center">{userSchool.title}</h4>
                            <p className="text-base text-gray-300 leading-relaxed mt-4 flex-grow">{userSchool.description}</p>
                            <p className="text-sm text-yellow-300/70 italic text-center mt-4 p-3 bg-black/20 rounded-md border border-yellow-800/50">{userSchool.costBlurb}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Select a Dominion on Page 1 to see your school.</p>
                )}
            </section>

            {/* Headmaster Section */}
            <section className="my-16">
                <SectionSubHeader>What kind of person is your school's headmaster / headmistress? In Multiplayer, this is locked to Competent.</SectionSubHeader>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {HEADMASTERS_DATA.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedHeadmasterId === item.id} onSelect={handleHeadmasterSelect} disabled={isMultiplayer && item.id !== 'competent'} selectionColor="brown" />)}
                </div>
            </section>

            {/* Teacher Section */}
            <section className="my-16">
                <SectionSubHeader>Now, choose the archetypes of 3-5 teachers whom you will interact with the most during your education here. No repeats!</SectionSubHeader>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {TEACHERS_DATA.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedTeacherIds.has(item.id)} onSelect={handleTeacherSelect} disabled={!selectedTeacherIds.has(item.id) && selectedTeacherIds.size >= 5} selectionColor="brown" />)}
                </div>
            </section>
            
             {/* Duration Section */}
            <section className="my-16">
                <SectionSubHeader>And, at last: just how long do you think you'll be going to be studying at this institution? Don't be afraid to take your time!</SectionSubHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {DURATION_DATA.map(item => (
                        <ChoiceCard key={item.id} item={item} isSelected={selectedDurationId === item.id} onSelect={handleDurationSelect} selectionColor="brown" />
                    ))}
                </div>
            </section>
            
            {/* Clubs Section */}
            <section className="my-16">
                <SectionSubHeader>You can also choose any teams or clubs you may want to join. These may even aid in pursuing your future career prospects! Just try not to make yourself too busy.</SectionSubHeader>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {topClubs.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedClubIds.has(item.id)} onSelect={handleClubSelect} selectionColor="brown" />)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {otherClubs.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedClubIds.has(item.id)} onSelect={handleClubSelect} selectionColor="brown" />)}
                </div>
            </section>
            
             {/* Misc Activities Section */}
            <section className="my-16">
                <SectionSubHeader>And finally, choose any miscellaneous activities you may get up to to make the most out of your time at the academy.</SectionSubHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MISC_ACTIVITIES_DATA.map(item => (
                        <ChoiceCard key={item.id} item={item} isSelected={selectedMiscActivityIds.has(item.id)} onSelect={handleMiscActivitySelect} selectionColor="brown" imageShape="circle" />
                    ))}
                </div>
            </section>

             {/* Classmates Section */}
             <section className="my-16">
                <SectionHeader>Select Your Classmates</SectionHeader>
                <SectionSubHeader>Obviously you will have many classmates in your time at the school, but this will select the ones who will be most prominent in your life. Perhaps circumstances will conspire to make you friends? Fellow school club members? Maybe even teammates? You can pick as many as you can afford. At first, you'll usually only know their alter ego. Signature powers are permanently boosted. They all have the essential powers. You can select their uniform on the Outfits section on Page 1. Additionally, you get a 2 FP discount when purchasing classmates that from your own dominion.</SectionSubHeader>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {CLASSMATES_DATA.map(classmate => (
                        <ClassmateCard 
                            key={classmate.id} 
                            classmate={{...classmate, cost: getAdjustedCost(classmate)}} 
                            isSelected={selectedClassmateIds.has(classmate.id)} 
                            onSelect={handleClassmateSelect} 
                            disabled={isMultiplayer}
                            selectionColor="brown"
                        />
                    ))}
                </div>
             </section>
        </>
    );
}