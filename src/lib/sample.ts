import type { Paper } from "./types";
export const samplePaper: Paper = {
  id: "moonlight-sample-v1",
  sample: true,
  title: "Learning how to learn: The power of retrieval practice",
  authors: "Maya Chen, Daniel Park & Sofia Williams",
  publication: "A MOONSTRUCK LEARNING PAPER",
  pageCount: 6,
  sections: [
    {
      id: "abstract",
      title: "Abstract",
      page: 1,
      paragraphs: [
        {
          id: "a1",
          text: "Learning is not only about taking in information, but also about being able to recall it when it matters. Retrieval practice—the act of actively bringing information to mind—offers a simple yet powerful approach to lasting learning.",
          ko: "학습은 정보를 받아들이는 것뿐 아니라 필요할 때 떠올리는 과정이기도 합니다. 인출 연습은 기억 속 정보를 능동적으로 떠올리는 활동으로, 배운 내용을 오래 기억하는 데 도움이 됩니다.",
          kind: "claim",
          explanation:
            "This is the central claim: recalling information from memory can strengthen learning. The rest of the paper should provide evidence for it.",
          explanationKo:
            "이 논문의 핵심 주장입니다. 기억에서 정보를 떠올리면 학습에 도움이 된다는 주장에 어떤 근거가 있는지 살펴보세요.",
        },
        {
          id: "a2",
          text: "In this illustrative study, 120 university students were assigned to either repeated study or retrieval practice. Learning was assessed immediately and again after a one-week delay.",
          ko: "이 가상 연구에서는 대학생 120명을 반복 학습 집단과 인출 연습 집단에 배정했습니다. 학습 직후와 일주일 뒤에 학습 내용을 얼마나 기억하는지 평가했습니다.",
          kind: "method",
          explanation:
            "Notice the participants, the two conditions, and the delayed test. These details explain how the researchers compared learning strategies.",
          explanationKo:
            "참가자, 두 집단의 학습 방법, 일주일 뒤의 평가에 주목하세요. 연구자가 학습 전략을 어떻게 비교했는지 알려 주는 부분입니다.",
        },
        {
          id: "a3",
          text: "Students who practiced retrieval retained more information over time, despite reporting lower confidence in their learning. These findings suggest that effective learning strategies may feel more effortful than familiar ones.",
          ko: "인출 연습 집단은 학습에 대한 자신감이 더 낮았지만 시간이 지난 뒤 더 많은 내용을 기억했습니다. 효과적인 학습 방법이 익숙한 방법보다 더 어렵게 느껴질 수 있음을 보여 줍니다.",
          kind: "result",
          explanation:
            "The key finding separates perceived learning from measured retention. Feeling fluent is not necessarily the same as remembering later.",
          explanationKo:
            "학습했다고 느끼는 정도와 실제 기억한 정도를 구분하는 결과입니다. 술술 읽힌다고 해서 나중에도 잘 기억하는 것은 아닙니다.",
        },
      ],
    },
    {
      id: "introduction",
      title: "Introduction",
      page: 2,
      paragraphs: [
        {
          id: "i1",
          text: "How do we turn what we read into knowledge that stays with us? This question sits at the heart of learning science. Students often spend hours rereading notes and highlighting textbooks, yet find that much of what they studied fades surprisingly quickly.",
          ko: "읽은 내용을 오래 기억하려면 어떻게 해야 할까요? 이는 학습 과학의 핵심 질문입니다. 학생들은 노트를 다시 읽고 교과서에 밑줄을 긋는 데 많은 시간을 쓰지만, 배운 내용을 금세 잊기도 합니다.",
        },
        {
          id: "i2",
          text: "A growing body of research suggests that the way we practice remembering matters as much as the time we spend studying. Rather than simply reviewing material, retrieval practice asks learners to close the book and bring ideas to mind.",
          ko: "기억을 떠올리는 연습 방법은 공부에 들이는 시간만큼 중요할 수 있습니다. 인출 연습에서는 자료를 다시 읽는 대신 책을 덮고 핵심 내용을 떠올립니다.",
          kind: "claim",
          explanation:
            "Introductions move from a broad problem to a specific research question. Here, the question is whether recalling beats rereading.",
        },
        {
          id: "i3",
          text: "The present paper explores this distinction through a controlled comparison of two learning strategies. We also examine whether learners’ confidence accurately reflects their later performance.",
          ko: "이 논문은 두 학습 전략을 비교하고, 학습자의 자신감이 이후 평가 결과와 일치하는지도 살펴봅니다.",
        },
      ],
    },
    {
      id: "literature",
      title: "Literature review",
      page: 3,
      paragraphs: [
        {
          id: "l1",
          text: "Prior work distinguishes between short-term performance and durable learning. Repeated exposure can make a passage feel familiar, creating an impression of mastery without guaranteeing later recall.",
          ko: "선행 연구는 단기적인 수행과 오래 지속되는 학습을 구분합니다. 반복해서 읽으면 내용이 익숙해져 다 안다고 느낄 수 있지만, 나중에 떠올릴 수 있다는 보장은 없습니다.",
          kind: "claim",
        },
        {
          id: "l2",
          text: "The testing effect describes the observation that retrieving information can improve later retention. One proposed explanation is that retrieval strengthens access to a memory and provides an opportunity to identify gaps in understanding.",
          ko: "시험 효과란 정보를 떠올리는 활동이 이후의 기억 유지에 도움이 되는 현상을 뜻합니다. 인출을 통해 기억에 더 쉽게 접근하고 이해가 부족한 부분을 발견할 수 있다는 설명이 있습니다.",
        },
        {
          id: "l3",
          text: "However, learning conditions vary across studies. Differences in feedback, test format, and the interval before assessment make it important to interpret results within each study’s design.",
          ko: "다만 연구마다 학습 조건이 다릅니다. 피드백, 평가 형식, 평가까지의 간격을 고려해 각 연구의 결과를 해석해야 합니다.",
        },
      ],
    },
    {
      id: "study",
      title: "The present study",
      page: 4,
      paragraphs: [
        {
          id: "s1",
          text: "The illustrative sample comprised 120 university students, randomly assigned to two groups of 60. All participants read the same short science passage under identical initial conditions.",
          ko: "가상 표본은 대학생 120명으로 구성되며, 각 60명씩 두 집단에 무작위로 배정했습니다. 참가자 모두 같은 조건에서 짧은 과학 지문을 읽었습니다.",
          kind: "method",
        },
        {
          id: "s2",
          text: "The repeated-study group reread the passage for eight minutes. The retrieval-practice group wrote down everything they could remember without consulting the text, then received brief feedback.",
          ko: "반복 학습 집단은 8분 동안 지문을 다시 읽었습니다. 인출 연습 집단은 지문을 보지 않고 기억나는 내용을 모두 적은 뒤 짧은 피드백을 받았습니다.",
          kind: "method",
        },
        {
          id: "s3",
          text: "Participants completed an immediate comprehension test and a delayed test one week later. Both tests used the same scoring rubric, and participants rated their confidence before each assessment.",
          ko: "참가자들은 학습 직후와 일주일 뒤에 이해도 평가를 받았습니다. 두 평가에는 같은 채점 기준을 적용했으며, 참가자들은 평가 전에 자신의 자신감을 표시했습니다.",
          kind: "method",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      page: 5,
      paragraphs: [
        {
          id: "r1",
          text: "In this fictional dataset, the retrieval-practice group recalled 72% of the target ideas after one week, compared with 48% in the repeated-study group. Immediate performance was similar across conditions.",
          ko: "이 가상 데이터에서 인출 연습 집단은 일주일 뒤 목표 내용의 72%를 기억했고, 반복 학습 집단은 48%를 기억했습니다. 학습 직후의 결과는 두 집단이 비슷했습니다.",
          kind: "result",
        },
        {
          id: "r2",
          text: "Confidence ratings followed a different pattern: students who reread reported feeling better prepared. The divergence between confidence and delayed recall illustrates why subjective fluency may be a poor guide to durable learning.",
          ko: "자신감에서는 다른 양상이 나타났습니다. 지문을 다시 읽은 학생들이 더 잘 준비되었다고 느꼈습니다. 자신감과 일주일 뒤의 기억이 일치하지 않는다는 점은 주관적인 익숙함만으로 학습 성과를 판단하기 어렵다는 것을 보여 줍니다.",
          kind: "result",
        },
      ],
    },
    {
      id: "discussion",
      title: "Discussion",
      page: 6,
      paragraphs: [
        {
          id: "d1",
          text: "These illustrative findings support a practical lesson: make room for remembering, not just reviewing. After reading a section, pause and explain its main idea in your own words before looking back.",
          ko: "이 가상 사례는 복습할 때 다시 읽는 것과 함께 기억을 떠올리는 연습도 해 보라는 교훈을 줍니다. 한 절을 읽은 뒤 잠시 멈추고, 책을 다시 보기 전에 핵심 내용을 자신의 말로 설명해 보세요.",
          kind: "claim",
        },
        {
          id: "d2",
          text: "The design also has limitations. Feedback was provided only in the retrieval condition, so its contribution cannot be separated from retrieval itself. A single passage and a university sample further limit generalization.",
          ko: "연구 설계에는 한계도 있습니다. 인출 집단에만 피드백을 제공했기 때문에 피드백의 효과와 인출 자체의 효과를 구분할 수 없습니다. 지문 하나와 대학생 표본만 사용했다는 점도 결과를 일반화하는 데 한계가 됩니다.",
        },
        {
          id: "d3",
          text: "This paper was created as an educational example for moonstruck. Its authors, study, and numerical results are fictional and should not be cited as research evidence.",
          ko: "이 논문은 moonstruck 학습 예시로 제작되었습니다. 저자, 연구, 수치는 모두 가상이며 연구 근거로 인용해서는 안 됩니다.",
        },
      ],
    },
  ],
};
