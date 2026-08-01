export type DevotionalCategory = "daily" | "weekly" | "youth" | "family" | "marriage";

export interface Devotional {
  id: string;
  title: string;
  date: string;
  bibleVerse: string;
  bibleText: string;
  body: string;
  author: string;
  category: DevotionalCategory;
  tags: string[];
  reflectionQuestions: string[];
  prayer: string;
  image: string;
}

export const categoryConfig: Record<DevotionalCategory, { label: string; bg: string; text: string }> = {
  daily: { label: "Daily", bg: "bg-purple-50", text: "text-purple-700" },
  weekly: { label: "Weekly", bg: "bg-purple-50", text: "text-purple-700" },
  youth: { label: "Youth", bg: "bg-amber-50", text: "text-amber-700" },
  family: { label: "Family", bg: "bg-green-50", text: "text-green-700" },
  marriage: { label: "Marriage", bg: "bg-rose-50", text: "text-rose-700" },
};

export const devotionals: Devotional[] = [
  {
    id: "dv-01",
    title: "The God of New Beginnings",
    date: "2025-07-07",
    bibleVerse: "Isaiah 43:19",
    bibleText: "Behold, I am doing a new thing; now it springs forth, do you not perceive it? I will make a way in the wilderness and rivers in the desert.",
    body: "Every season of life carries the invitation of God to step into something fresh. The children of Israel had grown comfortable in their captivity, and even when God was ready to deliver them, many struggled to believe that change was possible. Isaiah prophesied to a people in exile, yet his words were pulsating with hope. God was not finished with them.\n\nSometimes we find ourselves in wilderness seasons — dry, barren, and seemingly directionless. The enemy wants us to believe that our current situation is permanent. But God specialises in making roads where there are none. He calls rivers out of the desert. What looks like an ending to the natural eye is often the beginning of something glorious in the Spirit.\n\nNotice that God says, \"do you not perceive it?\" The new thing was already in motion. The question was not whether God would act, but whether His people would have the spiritual eyes to see it. Many of us miss the new things God is doing because we are still staring at the old ruins.\n\nThis week, open your heart to the new thing God wants to do. Let go of the comfort of familiarity. Trust that the God who parted the Red Sea and who raised Lazarus from the dead is more than able to make a way for you. Your wilderness is about to become a highway of praise.",
    author: "Pastor Adebayo",
    category: "daily",
    tags: ["new beginnings", "hope", "faith", "wilderness"],
    reflectionQuestions: [
      "What 'wilderness' season are you currently walking through?",
      "Are you holding on to something old that is preventing you from embracing what God is doing now?",
      "How can you cultivate spiritual perception to see what God is doing around you?",
    ],
    prayer: "Father, I thank You that You are the God of new beginnings. Open my eyes to perceive the new things You are doing in my life. Give me the courage to let go of the past and step boldly into the future You have prepared for me. Make a way in my wilderness and cause rivers to flow in my desert. In Jesus' name, Amen.",
    image: "golden sunrise over calm water with rays of light piercing through morning mist",
  },
  {
    id: "dv-02",
    title: "Standing on the Promises",
    date: "2025-07-08",
    bibleVerse: "2 Corinthians 1:20",
    bibleText: "For all the promises of God find their Yes in him. That is why it is through him that we utter our Amen to God for his glory.",
    body: "The Bible contains over three thousand promises from God to His people. These are not mere suggestions or wishful thoughts — they are covenant declarations backed by the integrity of the Almighty. When God makes a promise, He does not waver. The challenge is rarely on God's side; it is almost always on ours.\n\nThe Apostle Paul reminds us that every single promise God has ever made finds its fulfilment in Christ. When you stand on a promise from Scripture, you are not standing on wishful thinking — you are standing on the finished work of Calvary. The cross is the guarantee that God will keep His word.\n\nMany believers quote promises but do not truly believe them. We recite Scriptures with our lips while our hearts are filled with doubt. Faith is not the absence of questions; it is the decision to trust God in spite of them. It is choosing to anchor your soul in the unchanging character of God rather than the shifting circumstances of life.\n\nToday, identify a specific promise from God's Word that speaks to your current situation. Write it down. Meditate on it. Declare it over your life. Then watch how God honours His word. He is not a man that He should lie. If He said it, He will do it.",
    author: "Pastor Mrs. Funke",
    category: "daily",
    tags: ["promises", "faith", "covenant", "assurance"],
    reflectionQuestions: [
      "Which promise of God do you need to stand on today?",
      "What makes it difficult for you to fully trust God's promises?",
      "How does the cross of Christ guarantee God's faithfulness?",
    ],
    prayer: "Lord, I stand on Your promises today. I believe that every word You have spoken concerning me shall come to pass. Strengthen my faith where it is weak, and help me to hold on to Your Word with unwavering confidence. In Jesus' name, Amen.",
    image: "strong ancient tree with deep roots visible beside a flowing river at golden hour",
  },
  {
    id: "dv-03",
    title: "The Power of Gratitude",
    date: "2025-07-09",
    bibleVerse: "1 Thessalonians 5:18",
    bibleText: "Give thanks in all circumstances; for this is the will of God in Christ Jesus for you.",
    body: "Gratitude is not a feeling — it is a spiritual discipline. The Apostle Paul did not say give thanks for all circumstances, but rather in all circumstances. There is a profound difference. You do not have to be thankful for the pain, the loss, or the disappointment. But you can be thankful in the midst of it, because you know that God is working all things together for your good.\n\nPaul wrote these words from a prison cell. He was chained, beaten, and misunderstood. Yet he chose gratitude. He understood that thanksgiving is the gateway to God's presence. When you are grateful, your focus shifts from the problem to the Problem-Solver.\n\nScience has even confirmed what Scripture has taught for millennia. People who practise gratitude regularly experience lower levels of anxiety and depression, better sleep, stronger relationships, and greater resilience. But for the believer, gratitude goes far beyond mental health — it is an act of spiritual warfare.\n\nMake it a habit to start every day with thanksgiving. Before you present your requests, present your praises. Before you complain about what you do not have, celebrate what God has already done. A grateful heart is a magnet for God's blessings.",
    author: "Minister Chukwu",
    category: "daily",
    tags: ["gratitude", "thanksgiving", "joy", "peace"],
    reflectionQuestions: [
      "What are three things you are grateful to God for right now?",
      "How can you practise gratitude even in difficult circumstances?",
      "What would change in your daily life if you started every morning with thanksgiving?",
    ],
    prayer: "Father, I thank You for who You are and for all You have done in my life. Even when I do not understand my circumstances, I choose to trust You and give You thanks. Fill my heart with gratitude that overflows into every area of my life. In Jesus' name, Amen.",
    image: "hands raised in worship during golden sunrise with soft lens flare and warm tones",
  },
  {
    id: "dv-04",
    title: "Walking in Divine Wisdom",
    date: "2025-07-10",
    bibleVerse: "James 1:5",
    bibleText: "If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.",
    body: "Life is filled with decisions — some small, others life-altering. In a world of conflicting voices and endless opinions, the need for divine wisdom has never been greater. The good news is that God does not withhold wisdom from those who ask. He gives generously and without reproach, meaning He will never make you feel foolish for asking.\n\nJames connects wisdom to faith. When you ask, you must believe that God will answer. Doubt creates instability — a person who doubts is like a wave of the sea, driven and tossed by the wind. This does not mean you will never have questions. It means that beneath your questions, there is a bedrock of trust that God is faithful.\n\nThe wisdom of God is different from human intelligence. A person can have multiple degrees and still make foolish decisions. God's wisdom is practical, timely, and Spirit-led. It comes through prayer, meditation on Scripture, godly counsel, and the inner witness of the Holy Spirit.\n\nAs you go about your day, remember that God is ready to guide you. Before you make that decision, pause and ask. Before you speak that word, pray and listen. The God who created the universe with His wisdom is more than willing to share it with you.",
    author: "Pastor Adebayo",
    category: "daily",
    tags: ["wisdom", "decisions", "guidance", "Holy Spirit"],
    reflectionQuestions: [
      "Is there a decision you are currently facing that needs divine wisdom?",
      "How do you typically seek God's guidance when making important choices?",
      "What does it mean to ask in faith without doubting?",
    ],
    prayer: "Father, I ask You for wisdom today. Grant me the discernment to know Your will and the courage to follow it. Let Your wisdom guide my thoughts, my words, and my actions. I trust that as I ask, You will give generously. In Jesus' name, Amen.",
    image: "ancient open book with golden light emanating from its pages on a wooden desk",
  },
  {
    id: "dv-05",
    title: "The Armor of God for Young Believers",
    date: "2025-07-11",
    bibleVerse: "Ephesians 6:11",
    bibleText: "Put on the whole armour of God, that you may be able to stand against the schemes of the devil.",
    body: "As a young person in today's world, you are constantly bombarded with messages that contradict the Word of God. Social media, peer pressure, cultural trends, and academic pressures all compete for your attention and allegiance. The Apostle Paul understood this reality and provided a powerful metaphor for spiritual readiness: the armour of God.\n\nThe belt of truth, the breastplate of righteousness, the shoes of the gospel of peace, the shield of faith, the helmet of salvation, and the sword of the Spirit — these are not optional accessories. They are essential equipment for every believer, regardless of age. You cannot afford to go into battle unarmed.\n\nThe enemy's strategy has not changed. He still uses lies, deception, temptation, and intimidation. But God has given you everything you need to stand firm. The shield of faith is particularly important for young people. When doubts come, lift your shield. When friends mock your convictions, stand your ground.\n\nRemember that David defeated Goliath not with Saul's armour, but with faith in the living God. God has equipped you uniquely for the battles you face. Put on the armour daily through prayer, worship, and the Word. You are more than a conqueror through Christ who loves you.",
    author: "Minister Chukwu",
    category: "youth",
    tags: ["spiritual warfare", "youth", "armor of God", "faith"],
    reflectionQuestions: [
      "Which piece of the armour of God do you need to strengthen most right now?",
      "What are the biggest spiritual battles you face as a young believer?",
      "How can you make 'putting on the armour' a daily practice?",
    ],
    prayer: "Lord, I put on the whole armour of God today. Gird me with Your truth, cover me with Your righteousness, and equip my feet with the gospel of peace. Let my shield of faith quench every fiery dart of the enemy. In Jesus' name, Amen.",
    image: "young person standing confidently on a mountaintop at dawn with dramatic clouds",
  },
  {
    id: "dv-06",
    title: "Building a Home of Prayer",
    date: "2025-07-12",
    bibleVerse: "Joshua 24:15",
    bibleText: "But as for me and my house, we will serve the Lord.",
    body: "The family is the smallest unit of the church and the most powerful training ground for faith. Joshua's declaration was not merely a personal statement — it was a family covenant. In an age where families are pulled in a thousand different directions, this kind of intentionality is desperately needed.\n\nBuilding a home of prayer does not happen by accident. It requires deliberate choices: choosing to pray together before meals, choosing to have family devotions, choosing to turn off the television and open the Bible, choosing to speak blessings over your children rather than curses.\n\nPrayer is the foundation upon which every other family value rests. A family that prays together is not immune to challenges, but it is equipped to face them with divine strength. When children see their parents on their knees, it leaves an impression that no sermon or Sunday school lesson can replicate.\n\nIf your family has not yet established a culture of prayer, today is the perfect day to begin. Start small. Five minutes together. One Scripture. One honest prayer. Consistency is more important than length. God honours the heart that seeks Him, and as you make your home a house of prayer, He will fill it with His presence.",
    author: "Pastor Mrs. Funke",
    category: "family",
    tags: ["family", "prayer", "home", "children"],
    reflectionQuestions: [
      "What does a 'home of prayer' look like in your current season of life?",
      "What is one practical step you can take this week to strengthen prayer in your family?",
      "How did prayer shape the family you grew up in?",
    ],
    prayer: "Heavenly Father, I commit my family to You. Help us to build a home where prayer is our first response, not our last resort. Teach us to pray together, worship together, and grow together in Your Word. In Jesus' name, Amen.",
    image: "warm family silhouettes holding hands in prayer around a candlelit table",
  },
  {
    id: "dv-07",
    title: "Love That Endures",
    date: "2025-07-13",
    bibleVerse: "1 Corinthians 13:7",
    bibleText: "Love bears all things, believes all things, hopes all things, endures all things.",
    body: "The world's definition of love is often shallow and conditional — based on feelings, convenience, and mutual benefit. But God's love is fundamentally different. It is a love that bears, believes, hopes, and endures. These four verbs describe a love that is active, resilient, and deliberate. This is the kind of love that sustains a marriage through the storms of life.\n\nTo bear all things means to cover, to protect, to keep no record of wrongs. In marriage, this means giving your spouse the benefit of the doubt. It means choosing not to broadcast their weaknesses to others. It means creating a safe place where vulnerability is honoured.\n\nTo believe all things is not naivety — it is choosing to trust. It is believing the best about your spouse even when evidence suggests otherwise. To hope all things is to maintain a vision for what God can do in your marriage. To endure all things is to stay, to remain, to persist. Marriage is not a sprint; it is a marathon.\n\nIf your marriage is struggling today, take heart. God is the author of love, and He is able to restore what is broken. Return to the Source. Ask Him to fill your heart with His kind of love — the love that does not give up.",
    author: "Pastor Adebayo",
    category: "marriage",
    tags: ["love", "marriage", "endurance", "grace"],
    reflectionQuestions: [
      "Which of the four verbs — bears, believes, hopes, endures — is hardest for you?",
      "How can you practically 'believe all things' about your spouse this week?",
      "What would it look like to love your spouse with God's love?",
    ],
    prayer: "Father, I thank You for the gift of marriage. Fill my heart with Your love — a love that bears, believes, hopes, and endures. Help me to see my spouse through Your eyes and to extend the same grace You have shown me. In Jesus' name, Amen.",
    image: "intertwined hands of an elderly couple with wedding rings against soft blurred background",
  },
  {
    id: "dv-08",
    title: "The Discipline of Waiting",
    date: "2025-07-14",
    bibleVerse: "Isaiah 40:31",
    bibleText: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
    body: "Waiting is one of the most difficult disciplines of the Christian life. We live in an instant culture — instant food, instant communication, instant results. So when God asks us to wait, it feels counterintuitive, even painful. But waiting on God is not passive inactivity. It is active trust. It is the deliberate positioning of your heart in a posture of expectation.\n\nThe Hebrew word for wait used here is 'qavah,' which literally means to bind together, to twist strands into a strong cord. Waiting on God is not sitting idly by. It is the process by which God weaves His strength into the fabric of your being. While you wait, He is working — reshaping your character, deepening your faith, preparing you for what He has prepared.\n\nThe promise attached to waiting is extraordinary. Those who wait shall renew their strength. They shall mount up with wings like eagles. The eagle does not simply survive the storm — it uses the wind of the storm to soar to greater heights. In the same way, your season of waiting is not wasted. It is the very means by which God is elevating you.\n\nPerhaps you have been waiting for a breakthrough — for healing, for provision, for a life partner, for a child, for a career opportunity. Do not give up. God's timing is not your timing, but it is always perfect. While you wait, worship. While you wait, serve. While you wait, prepare. Your strength is being renewed even now.",
    author: "Pastor Mrs. Funke",
    category: "daily",
    tags: ["waiting", "patience", "strength", "trust"],
    reflectionQuestions: [
      "What are you currently waiting on God for?",
      "How can you make your waiting period a time of active trust rather than passive frustration?",
      "What has God taught you during previous seasons of waiting?",
    ],
    prayer: "Lord, I surrender my timeline to You. While I wait, renew my strength. Help me to trust Your process and to use this season for growth and preparation. Give me the patience to wait well and the faith to believe that You are working behind the scenes. In Jesus' name, Amen.",
    image: "eagle soaring above misty mountain peaks at sunrise with dramatic golden light",
  },
  {
    id: "dv-09",
    title: "The Peace That Passes Understanding",
    date: "2025-07-15",
    bibleVerse: "Philippians 4:6-7",
    bibleText: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
    body: "Anxiety has become an epidemic in our generation. The pressures of daily life — financial worries, health concerns, family challenges, career uncertainties — can feel overwhelming. The Apostle Paul understood this reality deeply. He wrote these words from a Roman prison, facing an uncertain future. Yet his counsel was not to worry less, but to pray more.\n\nThe connection between prayer and peace is inseparable. Paul outlines a specific sequence: prayer, supplication, and thanksgiving. Prayer is communion with God — acknowledging His sovereignty and goodness. Supplication is the presentation of your specific needs — being honest and detailed before God. Thanksgiving is the expression of gratitude — even before the answer comes.\n\nWhen these three elements come together, something supernatural happens. The peace of God — not your own peace, but His — floods your heart and mind. This peace surpasses understanding, meaning it does not make logical sense. You should be worried, but you are not. You should be afraid, but you are not. The circumstances have not changed, but you have.\n\nThis peace also acts as a guard. The Greek word 'phroureō' carries a military connotation — it describes a garrison of soldiers standing watch. God's peace does not merely calm you; it protects you. It stands guard over your thoughts and emotions, preventing the enemy from stealing your joy and undermining your faith.\n\nWhatever is causing you anxiety today, bring it to God in prayer. Be specific. Be honest. And above all, be thankful. As you do, His peace will guard your heart and mind in Christ Jesus.",
    author: "Pastor Adebayo",
    category: "daily",
    tags: ["peace", "anxiety", "prayer", "trust"],
    reflectionQuestions: [
      "What is the greatest source of anxiety in your life right now?",
      "Are you bringing your worries to God through prayer, supplication, and thanksgiving?",
      "How have you experienced God's peace in difficult times before?",
    ],
    prayer: "Father, I bring every worry and every concern to You today. I refuse to carry what You have invited me to cast upon You. Fill me with Your peace — a peace that passes all understanding. Guard my heart and my mind from the attacks of the enemy. In Jesus' name, Amen.",
    image: "calm still lake reflecting a pastel sunset sky with gentle ripples and distant treeline",
  },
  {
    id: "dv-10",
    title: "Finding Your Identity in Christ",
    date: "2025-07-16",
    bibleVerse: "Ephesians 2:10",
    bibleText: "For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.",
    body: "One of the greatest struggles of every generation is the search for identity. We look for who we are in our achievements, our relationships, our social media profiles, and our possessions. But all of these things are fragile. They can be lost in a moment. Your true identity is not found in what you do — it is found in whose you are.\n\nPaul tells us that we are God's workmanship. The Greek word is 'poiēma,' from which we get the English word 'poem.' You are not an accident. You are not a cosmic afterthought. You are a carefully crafted masterpiece, designed by the Master Artist Himself. Before you were born, God had already written the story of your life. He prepared good works for you to walk in.\n\nThis truth is liberating. It means your worth is not determined by your performance, your appearance, or your bank account. It is secured by the blood of Jesus. When God looks at you, He does not see your failures — He sees His Son. You are accepted, chosen, beloved, and called.\n\nFor young people especially, the pressure to conform, to perform, and to prove yourself can be crushing. But you do not need to prove anything to anyone. You are already approved by the only One whose opinion truly matters. Walk in the identity God has given you. Live the poem He has written with your life.",
    author: "Minister Chukwu",
    category: "youth",
    tags: ["identity", "youth", "purpose", "self-worth"],
    reflectionQuestions: [
      "Where have you been looking for your identity besides Christ?",
      "What does it mean to you that you are God's 'workmanship'?",
      "How would your daily choices change if you fully believed you are chosen and loved by God?",
    ],
    prayer: "Father, I thank You that I am Your workmanship. Help me to find my identity in Christ alone — not in my achievements, my appearance, or the opinions of others. Show me the good works You have prepared for me and give me the courage to walk in them. In Jesus' name, Amen.",
    image: "potter's hands carefully shaping clay on a spinning wheel with warm studio lighting",
  },
  {
    id: "dv-11",
    title: "The Generosity of God's Grace",
    date: "2025-07-17",
    bibleVerse: "Ephesians 2:8-9",
    bibleText: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.",
    body: "Grace is the heartbeat of the Christian faith. Without it, there is no salvation, no hope, no relationship with God. Grace is unmerited favour — receiving what you do not deserve. It is the greatest gift ever given, and it cost God everything.\n\nThe danger for many believers is that after receiving grace, we gradually slip back into a performance-based mindset. We begin to believe that God's love is conditional — that it depends on how well we pray, how often we attend church, or how much we give. This is a subtle but devastating shift. It reduces the gospel from good news to good advice.\n\nPaul is emphatic: salvation is by grace through faith, and it is not your own doing. It is a gift. You did not earn it, and you cannot lose it by failing to measure up. This does not mean we are free to live carelessly — grace is not a licence to sin but the power to overcome it. It means that our motivation for holiness is gratitude, not guilt.\n\nWhen you truly understand grace, it transforms everything. You worship differently — not to earn God's favour, but because you already have it. You serve differently — not to prove your worth, but because you are already worthy in Christ. You give differently — not under compulsion, but with joyful abandon.\n\nToday, take a moment to reflect on the grace of God. You were dead in trespasses and sins, but God made you alive together with Christ. That is grace. That is love. Let that truth sink deep into your spirit and let it overflow into every area of your life.",
    author: "Pastor Adebayo",
    category: "daily",
    tags: ["grace", "salvation", "faith", "gospel"],
    reflectionQuestions: [
      "How would you explain God's grace to someone who has never heard the gospel?",
      "In what areas of your life have you slipped back into a performance-based mindset?",
      "How does understanding grace change the way you approach God in prayer?",
    ],
    prayer: "Father, I am overwhelmed by Your grace. Thank You for saving me not by my works but by Your unmerited favour. Help me to live each day in the fullness of that grace — worshiping freely, serving joyfully, and loving generously. Let Your grace be the foundation of everything I do. In Jesus' name, Amen.",
    image: "open hands receiving golden light from above in a dark room with rays streaming down",
  },
  {
    id: "dv-12",
    title: "Raising Godly Children in a Secular World",
    date: "2025-07-18",
    bibleVerse: "Proverbs 22:6",
    bibleText: "Train up a child in the way he should go; even when he is old he will not depart from it.",
    body: "Parenting in the twenty-first century is one of the greatest challenges a believer can face. Our children are growing up in a world that is increasingly hostile to biblical values. From the content they consume online to the ideologies taught in schools, there is a constant pull away from God's truth. As parents, we cannot afford to be passive.\n\nProverbs 22:6 is both a command and a promise. The command is to train — to intentionally, deliberately, and consistently shape the spiritual trajectory of your children. This requires more than dropping them off at Sunday school. It means modelling a vibrant relationship with God in your own life. Children learn more from what they observe than from what they are told.\n\nTraining involves discipline — not the harsh, punitive kind, but the loving, consistent kind that sets boundaries and enforces them with grace. It involves instruction — teaching them the Scriptures, helping them understand why we believe what we believe, and equipping them to defend their faith. It involves prayer — covering your children daily in prayer, even before they are born.\n\nThe promise is that when they are old, they will not depart from the way. This does not mean your children will never stray. Some will. But the foundation you have laid will eventually bring them back. The seeds you plant today will bear fruit in the future, even if you cannot see it yet.\n\nDo not grow weary in well-doing. Your investment in the spiritual lives of your children is the most important investment you will ever make. God entrusted them to you for a purpose. Raise them for His glory.",
    author: "Pastor Mrs. Funke",
    category: "family",
    tags: ["parenting", "children", "family", "training"],
    reflectionQuestions: [
      "What are you doing intentionally to train your children in the ways of God?",
      "How can you model a vibrant relationship with God for your children to observe?",
      "Are you praying consistently for your children? What specific prayers do you pray?",
    ],
    prayer: "Lord, I commit my children to You. Give me the wisdom and the grace to train them in Your ways. Protect them from the deceptions of this world and anchor their hearts in Your truth. Let the seeds I am planting today bear fruit that will last for eternity. In Jesus' name, Amen.",
    image: "parent and child walking together holding hands through a sunlit meadow with wildflowers",
  },
  {
    id: "dv-13",
    title: "Forgiveness: Setting Yourself Free",
    date: "2025-07-19",
    bibleVerse: "Ephesians 4:32",
    bibleText: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
    body: "Forgiveness is one of the most difficult commands in the entire Bible. When someone has deeply wounded you — betrayed your trust, spoken evil against you, or taken something precious from you — the natural response is anger, bitterness, and a desire for retaliation. But Jesus calls us to a supernatural response: forgiveness.\n\nPaul grounds our forgiveness of others in the forgiveness we have received from God. This is the key. We do not forgive because the person deserves it. We forgive because we did not deserve God's forgiveness either. When we realise the magnitude of what God has forgiven us, it becomes — not easy, but possible — to extend that same grace to others.\n\nUnforgiveness is like drinking poison and expecting the other person to die. It does not harm the offender; it destroys the offended. Medical studies show that harbouring bitterness increases stress hormones, weakens the immune system, and contributes to heart disease. But the spiritual damage is far greater. Unforgiveness creates a barrier between you and God. Jesus said that if you do not forgive others, neither will your Father forgive your trespasses.\n\nForgiveness is not saying that what happened was acceptable. It is not minimising the offence or pretending it did not hurt. It is releasing the offender from the debt they owe you and entrusting justice to God. It is a decision of the will, not a feeling of the emotions. You may not feel like forgiving, but you can choose to forgive.\n\nIf there is someone you need to forgive today, do not wait until you feel ready. Obey God now. As you release them, you will find that you are the one who is set free.",
    author: "Minister Chukwu",
    category: "daily",
    tags: ["forgiveness", "freedom", "healing", "grace"],
    reflectionQuestions: [
      "Is there someone you have been harbouring unforgiveness toward?",
      "How does understanding God's forgiveness of you make it easier to forgive others?",
      "What practical step can you take today to walk in forgiveness?",
    ],
    prayer: "Father, I choose to forgive today — not because it is easy, but because You have forgiven me. I release every person who has wronged me from the debt I feel they owe me. Heal the wounds in my heart and set me free from the bondage of unforgiveness. In Jesus' name, Amen.",
    image: "broken chains lying on a rock with sunrise breaking through clouds in the background",
  },
  {
    id: "dv-14",
    title: "The Blessing of Unity in Marriage",
    date: "2025-07-20",
    bibleVerse: "Ecclesiastes 4:9-12",
    bibleText: "Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow. But woe to him who is alone when he falls and has not another to lift him up. A threefold cord is not quickly broken.",
    body: "Marriage was God's idea from the very beginning. He looked at Adam in the garden and said, \"It is not good for the man to be alone.\" Marriage is not merely a social contract or a cultural institution — it is a divine creation, designed to reflect the relationship between Christ and His church. When a marriage functions according to God's design, it is one of the most powerful forces on earth.\n\nSolomon paints a beautiful picture of marital partnership. Two are better than one. They have a good reward for their toil — meaning that together, they accomplish more than either could alone. When one falls, the other lifts them up. And the most powerful image: a threefold cord is not quickly broken. When God is at the centre of a marriage, that marriage has a strength that nothing can overcome.\n\nUnity in marriage does not mean uniformity. You and your spouse are different people with different personalities, temperaments, and perspectives. Unity means that despite your differences, you are moving in the same direction, pursuing the same goals, and submitting to the same Lord. It means that when disagreements arise — and they will — you resolve them with love and respect, not with manipulation and control.\n\nIf your marriage feels strained, the first step is to re-centre it on Christ. Spend time in prayer together. Study the Word together. Seek godly counsel. God is able to restore the years the locusts have eaten and to breathe new life into what feels dead. Your marriage is worth fighting for.",
    author: "Pastor Adebayo",
    category: "marriage",
    tags: ["unity", "marriage", "partnership", "commitment"],
    reflectionQuestions: [
      "How would you describe the current level of unity in your marriage?",
      "What practical steps can you take to strengthen the 'threefold cord' in your home?",
      "Is there an unresolved conflict in your marriage that needs to be addressed?",
    ],
    prayer: "Lord, I bring my marriage before You today. Bind us together with the cord that cannot be broken — the cord of Your love. Help us to be one in spirit, one in purpose, and one in love. Heal every wound, bridge every gap, and restore every broken place. In Jesus' name, Amen.",
    image: "two candles with one flame merging together on a dark surface with soft warm glow",
  },
  // Weekly devotionals
  {
    id: "dw-01",
    title: "Deep Dive: The Heart of Worship",
    date: "2025-07-06",
    bibleVerse: "John 4:23-24",
    bibleText: "But the hour is coming, and is now here, when the true worshipers will worship the Father in spirit and truth, for the Father is seeking such people to worship him. God is spirit, and those who worship him must worship in spirit and truth.",
    body: "Worship is the highest calling of the human spirit. Before we were created to work, to serve, or to achieve, we were created to worship. The Westminster Shorter Catechism declares that the chief end of man is to glorify God and enjoy Him forever. Worship is not something we do for thirty minutes on Sunday morning — it is the orientation of our entire lives toward the glory of God.\n\nJesus' conversation with the woman at the well in Samaria reveals the nature of true worship. Two dimensions are essential: spirit and truth. Worship in spirit means that it must come from the innermost part of our being — not from external form or ritual, but from a heart that is genuinely engaged with God. Worship in truth means that it must be grounded in the revealed truth of who God is as declared in Scripture. Worship divorced from truth becomes emotionalism; truth divorced from worship becomes intellectualism.\n\nIn the Old Testament, worship was centered on the temple — a physical building with specific rituals, sacrifices, and priesthood. But Jesus announced a paradigm shift. The hour was coming when worship would no longer be confined to a location. It would be a matter of the heart. God was not seeking buildings, altars, or rituals — He was seeking people. People whose hearts were fully devoted to Him.\n\nThis has profound implications for our worship services today. The quality of our worship is not measured by the volume of the music, the eloquence of the preacher, or the grandeur of the building. It is measured by the sincerity of our hearts. Are we truly encountering God, or are we merely going through the motions?\n\nThis week, examine your worship life. Do you come into God's presence with expectation and reverence? Do you prepare your heart before entering His courts? Worship is not a performance for an audience — it is a love song to the King of kings. Let your life be a continuous act of worship, and let every gathering of the saints be a foretaste of the eternal worship that awaits us in glory.",
    author: "Pastor Adebayo",
    category: "weekly",
    tags: ["worship", "spirit and truth", "devotion", "Samaritan woman"],
    reflectionQuestions: [
      "What does it mean to worship God 'in spirit and truth' in your daily life?",
      "Is your Sunday worship genuine, or have you fallen into routine?",
      "How can you cultivate a lifestyle of worship beyond Sunday services?",
      "What distractions prevent you from fully engaging in worship?",
    ],
    prayer: "Father, I desire to be a true worshiper — one who worships You in spirit and in truth. Strip away every form of religion and ritual that has replaced genuine encounter. Fill my heart with such love for You that my entire life becomes an act of worship. Teach me to enter Your gates with thanksgiving and Your courts with praise. In Jesus' name, Amen.",
    image: "divine light streaming through stained glass windows onto an empty wooden pew with dust particles visible in the beam",
  },
  {
    id: "dw-02",
    title: "Weekly Study: Understanding Spiritual Gifts",
    date: "2025-07-13",
    bibleVerse: "1 Corinthians 12:7",
    bibleText: "To each is given the manifestation of the Spirit for the common good.",
    body: "The subject of spiritual gifts has caused both great blessing and great controversy in the body of Christ. Some churches emphasise them to the exclusion of all else; others ignore them entirely. But the Bible presents a balanced and beautiful picture of spiritual gifts as essential tools for building up the church and advancing God's kingdom.\n\nPaul makes it clear that every believer has been given at least one spiritual gift. There are no exceptions. You are not spiritually gifted because you are special — you are spiritually gifted because the Holy Spirit lives in you, and He distributes gifts as He wills. The purpose of these gifts is not personal elevation but the common good — the building up of the body of Christ.\n\nThe diversity of gifts is intentional. Just as a physical body has many parts with different functions, so does the body of Christ. The eye cannot say to the hand, 'I have no need of you.' Every gift is important. Every believer has a role to play. The gift of teaching is no more spiritual than the gift of serving. The gift of prophecy is no more important than the gift of giving. All gifts come from the same Spirit, and all are given for the same purpose.\n\nDiscovering your spiritual gift requires a combination of desire, experimentation, and confirmation. What do you long to do for God? What do others affirm in you? Where do you see fruit when you serve? These questions can help guide you toward your area of gifting. But the most important thing is not to identify your gift — it is to use it.\n\nThis week, commit to using your spiritual gift for the glory of God and the blessing of others. Do not bury your talent. Step out in faith and watch how God multiplies what you offer to Him. The church needs what you carry. The world needs what God has placed inside you.",
    author: "Minister Chukwu",
    category: "weekly",
    tags: ["spiritual gifts", "Holy Spirit", "service", "body of Christ"],
    reflectionQuestions: [
      "Do you know what your primary spiritual gift is?",
      "How are you currently using your gift to bless others?",
      "Are there gifts you have been afraid to explore or exercise?",
      "How can the church better help members discover and develop their gifts?",
    ],
    prayer: "Holy Spirit, I thank You for the gifts You have deposited in me. Help me to discover them, develop them, and deploy them for the building up of Your church. Give me boldness to step out and use what You have given me. Let my life bring glory to You and blessing to others. In Jesus' name, Amen.",
    image: "diverse group of hands raised together in a circle of prayer with warm overhead lighting",
  },
  {
    id: "dw-03",
    title: "Weekly Focus: Faith in the Furnace",
    date: "2025-07-14",
    bibleVerse: "Daniel 3:17-18",
    bibleText: "Our God whom we serve is able to deliver us from the burning fiery furnace, and he will deliver us out of your hand, O king. But if not, we will not serve your gods or worship the golden image that you have set up.",
    body: "The story of Shadrach, Meshach, and Abednego is one of the most powerful narratives in all of Scripture. Three young men, far from home, standing before the most powerful ruler on earth, faced with the choice between compromise and the furnace. Their response is one of the greatest declarations of faith ever recorded.\n\nNotice the structure of their faith. First, they affirmed the power of God: \"Our God is able to deliver us.\" They did not doubt God's capability. They believed He could save them from the fire. But then came the second, even more remarkable statement: \"But if not...\" They acknowledged that God's will might be different from their desire. He might choose not to deliver them. And even so, they would not bow.\n\nThis is mature faith. It is faith that trusts God not only for the outcome we want, but for the outcome He chooses. It is faith that says, \"God, I believe You can, and even if You do not, I will still serve You.\" This kind of faith is not naive optimism — it is bedrock conviction born of intimate relationship with God.\n\nMany of us are in our own furnaces right now. The heat is intense. The flames are real. And we are crying out to God for deliverance. There is nothing wrong with that. Jesus Himself cried out in the garden of Gethsemane. But let us also cultivate the 'but if not' faith — the faith that remains steadfast regardless of the outcome.\n\nThe amazing ending to this story is that God did deliver them — but not by putting out the fire. He joined them in it. The fourth man in the furnace was the Son of God. Sometimes God delivers you from the fire; sometimes He delivers you through it. Either way, He is with you, and not even the smell of smoke will be on your garments.",
    author: "Pastor Adebayo",
    category: "weekly",
    tags: ["faith", "trials", "Daniel", "furnace", "deliverance"],
    reflectionQuestions: [
      "What 'furnace' are you currently facing in your life?",
      "Can you say with Shadrach, Meshach, and Abednego, 'But if not, I will still serve God'?",
      "Has there been a time when God delivered you through the fire rather than from it?",
      "How does knowing God is with you in the furnace change your perspective on suffering?",
    ],
    prayer: "Father, give me the faith of Shadrach, Meshach, and Abednego. I believe You are able to deliver me. But even if You choose not to, I will not bow to any other god. I will serve You alone. Walk with me through the fire and let me come out without even the smell of smoke. In Jesus' name, Amen.",
    image: "dramatic flames of a furnace with three silhouetted figures standing unharmed and a fourth glowing figure among them",
  },
  {
    id: "dw-04",
    title: "Weekly Study: The Fruit of the Spirit",
    date: "2025-07-20",
    bibleVerse: "Galatians 5:22-23",
    bibleText: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law.",
    body: "The fruit of the Spirit is perhaps the most visible evidence of a life that is truly surrendered to God. While spiritual gifts are given for service, the fruit of the Spirit is produced for character. Gifts are about what you do; fruit is about who you are. Both are necessary, but fruit is the more reliable measure of spiritual maturity.\n\nPaul contrasts the works of the flesh with the fruit of the Spirit. The flesh produces: sexual immorality, impurity, sensuality, idolatry, sorcery, enmity, strife, jealousy, fits of anger, rivalries, dissensions, divisions, envy, drunkenness, orgies, and things like these. The Spirit produces: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. The contrast could not be starker.\n\nNotice that Paul calls it 'fruit' — singular, not 'fruits.' This is significant. The nine qualities listed are not separate fruits that you can pick and choose from. They are one fruit, with nine facets, that the Holy Spirit produces in the life of a yielded believer. You cannot have joy without love. You cannot have patience without peace. They grow together from the same root.\n\nThe key word is 'produce.' You cannot manufacture the fruit of the Spirit through self-effort. You can try to be more patient, more kind, more self-controlled in your own strength — but you will eventually fail. The fruit is called the fruit of the Spirit because only the Holy Spirit can produce it. Your responsibility is to abide in Christ, to yield to the Spirit, and to cooperate with His work in your heart.\n\nThis week, examine the fruit in your life. Not in comparison to others, but in comparison to the standard of Scripture. Where the fruit is lacking, do not try harder — surrender more. Spend more time in prayer, more time in the Word, and more time in worship. As you draw near to God, the fruit of the Spirit will naturally grow in your life, transforming you from the inside out.",
    author: "Pastor Mrs. Funke",
    category: "weekly",
    tags: ["fruit of the Spirit", "character", "Holy Spirit", "transformation"],
    reflectionQuestions: [
      "Which aspect of the fruit of the Spirit is most evident in your life right now?",
      "Which aspect needs the most growth?",
      "Are you trying to produce fruit in your own strength, or are you abiding in Christ?",
      "How does the fruit of the Spirit differ from the works of the flesh?",
    ],
    prayer: "Holy Spirit, I surrender my heart to You. Produce in me the fruit that reflects the character of Christ. Where there is bitterness, grow love. Where there is anxiety, grow peace. Where there is impatience, grow patience. Transform me from the inside out so that my life bears fruit that glorifies the Father. In Jesus' name, Amen.",
    image: "lush vineyard with ripe grapes hanging from the vine in warm afternoon sunlight with soft bokeh background",
  },
];

export function getDevotionalByDate(dateStr: string): Devotional | undefined {
  return devotionals.find((d) => d.date === dateStr);
}

export function getDevotionalsByRange(startDate: string, endDate: string): Devotional[] {
  return devotionals.filter((d) => d.date >= startDate && d.date <= endDate);
}

export function getAllCategories(): DevotionalCategory[] {
  return ["daily", "weekly", "youth", "family", "marriage"];
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  devotionalCount: number;
  icon: string;
}

export const readingPlans: ReadingPlan[] = [
  {
    id: "rp-01",
    title: "30 Days of Grace",
    description: "A month-long journey through the grace of God — from salvation to sanctification, from receiving grace to extending it to others.",
    duration: "30 Days",
    devotionalCount: 30,
    icon: "heart",
  },
  {
    id: "rp-02",
    title: "21 Days of Prayer",
    description: "A powerful prayer journey designed to deepen your prayer life, build consistency, and experience breakthrough in every area.",
    duration: "21 Days",
    devotionalCount: 21,
    icon: "flame",
  },
  {
    id: "rp-03",
    title: "7-Day Family Devotional",
    description: "A week of family-focused devotionals to strengthen bonds, ignite faith, and build a home that honours God.",
    duration: "7 Days",
    devotionalCount: 7,
    icon: "home",
  },
  {
    id: "rp-04",
    title: "14-Day Youth Challenge",
    description: "Two weeks of powerful devotionals crafted for young believers navigating faith, identity, and purpose in today's world.",
    duration: "14 Days",
    devotionalCount: 14,
    icon: "star",
  },
];