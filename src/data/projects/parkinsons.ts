import type { Project } from "@/lib/types";

export const parkinsons: Project = {
  slug: "parkinsons",
  name: "NeuroAssess",
  tagline: "Clinical Parkinson's screening portal with transformer-based text inference and decision-support reports.",
  description:
    "NeuroAssess is a clinical machine learning screening platform that analyzes patient text and structured clinical signals to estimate Parkinson's Disease risk as decision support, not diagnosis.",
  repo: "https://github.com/macayu17",
  status: "ongoing",
  domain: "Healthcare ML",
  domainColor:
    "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300",
  icon: "activity",
  architecture: {
    overview:
      "The platform separates model inference, clinical preprocessing, report generation, and the browser portal. The Flask layer loads the trained model and exposes prediction routes while the frontend collects input and explains results.",
    diagram: `graph TD
      Clinician[Clinician portal] --> Flask[Flask inference API]
      Flask --> Preprocess[Clinical text preprocessing]
      Preprocess --> Tokenizer[Tokenizer and feature builder]
      Tokenizer --> Model[Transformer classifier]
      Model --> Risk[Risk score and confidence]
      Risk --> Report[Decision-support report]
      Report --> Clinician
      Docs[Medical reference docs] --> Report`,
    layers: [
      {
        name: "Clinical input layer",
        description:
          "Collects patient text, symptom notes, and structured fields through a cautious healthcare-focused UI.",
        technologies: ["React", "TypeScript", "Tailwind"],
      },
      {
        name: "Inference API layer",
        description:
          "Loads the trained model, validates incoming fields, and returns prediction output with caveats.",
        technologies: ["Flask", "Python"],
      },
      {
        name: "ML pipeline layer",
        description:
          "Cleans clinical text, tokenizes input, and runs transformer inference for binary screening.",
        technologies: ["PyTorch", "Transformers", "scikit-learn"],
      },
      {
        name: "Report layer",
        description:
          "Turns model output into explainable screening language for clinicians and project interviews.",
        technologies: ["Report generation", "Clinical reference docs"],
      },
    ],
  },
  techStack: [
    {
      name: "Python",
      role: "Training scripts, preprocessing, inference, and report generation.",
      category: "backend",
    },
    {
      name: "PyTorch",
      role: "Transformer model definition, training, and inference.",
      category: "ml",
    },
    {
      name: "Transformers",
      role: "Tokenization and transformer architecture support.",
      category: "ml",
    },
    {
      name: "Flask",
      role: "Prediction API for the clinical screening workflow.",
      category: "backend",
    },
    {
      name: "pandas",
      role: "Clinical record cleaning and feature preparation.",
      category: "library",
    },
    {
      name: "scikit-learn",
      role: "Evaluation metrics, train-test splits, and preprocessing utilities.",
      category: "ml",
    },
  ],
  howItWorks: {
    summary:
      "The portal accepts clinical text, normalizes it, tokenizes it for a transformer model, returns a Parkinson's screening score, and frames the output as decision support.",
    steps: [
      {
        step: 1,
        title: "Collect clinical context",
        description:
          "The user enters clinical observations, symptom descriptions, and optional structured fields.",
      },
      {
        step: 2,
        title: "Clean and normalize",
        description:
          "The backend standardizes text, removes unusable fields, handles missing values, and prepares model features.",
      },
      {
        step: 3,
        title: "Tokenize input",
        description:
          "Clinical text is converted into token IDs and attention masks that the transformer can process.",
      },
      {
        step: 4,
        title: "Run inference",
        description:
          "The model produces a binary screening prediction and confidence score from the processed input.",
      },
      {
        step: 5,
        title: "Explain the result",
        description:
          "The portal presents risk, confidence, limitations, and suggested follow-up language without claiming diagnosis.",
      },
    ],
    sequenceDiagram: `sequenceDiagram
      participant Portal
      participant API as Flask API
      participant Prep as Preprocessor
      participant Model as Transformer
      Portal->>API: POST /predict
      API->>Prep: Normalize fields
      Prep-->>API: Token tensors
      API->>Model: Inference
      Model-->>API: Risk score
      API-->>Portal: Screening result and caveats`,
  },
  concepts: [
    {
      name: "Transformer Architecture",
      category: "ml",
      definition:
        "A neural architecture that uses attention instead of recurrence to model relationships in sequences.",
      explanation:
        "Transformers process all positions in parallel and learn which tokens should attend to each other. This makes them effective for long text where important clues may be far apart.",
      relevance:
        "NeuroAssess uses transformer inference to capture clinical wording patterns that simpler bag-of-words features can miss.",
    },
    {
      name: "Self-Attention",
      category: "ml",
      definition:
        "A mechanism where each token scores and aggregates information from other tokens in the same sequence.",
      explanation:
        "Self-attention lets a model connect symptom descriptions, temporal cues, and clinical terms even when they appear in different parts of the note.",
      relevance:
        "The Parkinson's classifier relies on attention to connect clinical text evidence before producing a screening output.",
    },
    {
      name: "Binary Classification",
      category: "ml",
      definition:
        "A predictive task with two possible classes such as positive or negative screening.",
      explanation:
        "Binary classifiers usually output a probability or logit that is converted into a class using a threshold. The threshold affects sensitivity and specificity.",
      relevance:
        "NeuroAssess frames the task as Parkinson's risk versus no risk for a first-pass clinical screening workflow.",
    },
    {
      name: "Sensitivity and Specificity",
      category: "healthcare",
      definition:
        "Medical evaluation metrics measuring true positive rate and true negative rate.",
      explanation:
        "Sensitivity matters when missing a condition is costly; specificity matters when false alarms burden clinicians. Screening tools often prioritize sensitivity while explaining uncertainty.",
      relevance:
        "The project discusses model quality in clinical terms instead of only generic accuracy.",
    },
    {
      name: "Clinical Decision Support",
      category: "healthcare",
      definition:
        "Software that assists clinical judgment without replacing a clinician.",
      explanation:
        "A decision-support tool must communicate limitations, uncertainty, and follow-up steps because model predictions are not medical diagnoses.",
      relevance:
        "NeuroAssess presents outputs with caveats and report language designed for clinician review.",
    },
  ],
  codeHighlights: [
    {
      title: "Inference route",
      description:
        "The API validates text input, builds tensors, and returns a cautious screening result.",
      language: "python",
      code: `@app.post("/predict")
def predict():
    payload = request.get_json(force=True)
    clinical_text = payload.get("clinicalText", "").strip()
    if not clinical_text:
        return jsonify({"error": "clinicalText is required"}), 400

    encoded = tokenizer(
        clinical_text,
        truncation=True,
        padding="max_length",
        max_length=256,
        return_tensors="pt",
    )
    with torch.no_grad():
        logits = model(**encoded).logits
        probability = torch.softmax(logits, dim=1)[0, 1].item()

    return jsonify({
        "riskScore": round(probability, 4),
        "screening": "review" if probability >= 0.5 else "low_risk",
        "disclaimer": "Decision support only; not a diagnosis.",
    })`,
      annotations: [
        "The route rejects empty clinical text before the model path.",
        "The response includes a medical disclaimer because screening output is not diagnosis.",
      ],
    },
    {
      title: "Clinical metric framing",
      description:
        "Model evaluation reports sensitivity and specificity so interview answers stay healthcare-aware.",
      language: "python",
      code: `def clinical_metrics(y_true, y_pred):
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    sensitivity = tp / (tp + fn)
    specificity = tn / (tn + fp)
    return {
        "sensitivity": round(sensitivity, 3),
        "specificity": round(specificity, 3),
    }`,
      annotations: [
        "Medical ML should not be defended with accuracy alone.",
        "Sensitivity and specificity expose the false-negative and false-positive trade-off.",
      ],
    },
  ],
  apiDesign: {
    baseUrl: "http://localhost:5000",
    endpoints: [
      {
        method: "POST",
        path: "/predict",
        description:
          "Runs Parkinson's screening inference for clinical text.",
        requestBody: '{ "clinicalText": "Patient reports tremor and gait instability." }',
        responseBody:
          '{ "riskScore": 0.7134, "screening": "review", "disclaimer": "Decision support only; not a diagnosis." }',
      },
      {
        method: "POST",
        path: "/report",
        description:
          "Generates a clinician-readable report for a prediction result.",
      },
    ],
  },
  databaseDesign: {
    type: "Model artifact and local medical document store",
    diagram: `erDiagram
      MODEL_ARTIFACT ||--o{ PREDICTION : serves
      MEDICAL_DOC ||--o{ REPORT_REFERENCE : cites
      PREDICTION ||--o{ REPORT_REFERENCE : explains`,
    tables: [
      {
        name: "model_artifact",
        description:
          "Serialized model, tokenizer settings, and preprocessing configuration.",
        fields: ["model_path", "tokenizer_name", "max_length", "trained_at"],
      },
      {
        name: "prediction_log",
        description:
          "Optional local record of screening requests for development and audit experiments.",
        fields: ["prediction_id", "risk_score", "screening", "created_at"],
      },
      {
        name: "medical_docs",
        description:
          "Reference documents used by the portal's explanatory report workflow.",
        fields: ["doc_id", "title", "source", "summary"],
      },
    ],
  },
  tradeoffs: [
    {
      decision: "Model family",
      chose: "Transformer classifier",
      over: "LSTM or bag-of-words model",
      reasoning:
        "Clinical notes can contain long-range context. Attention gives stronger handling of distant cues than recurrent or shallow text features.",
    },
    {
      decision: "API framework",
      chose: "Flask",
      over: "FastAPI",
      reasoning:
        "The inference service is request-response oriented and small. Flask is sufficient and keeps the clinical ML path straightforward.",
    },
    {
      decision: "Product framing",
      chose: "Decision support",
      over: "Diagnostic claim",
      reasoning:
        "A model prediction should support review, not replace clinical judgment or overstate medical validity.",
    },
  ],
  challenges: [
    {
      problem:
        "Class imbalance can make a model look accurate while missing positive cases.",
      solution:
        "Evaluate with sensitivity, specificity, confusion matrices, and threshold discussion.",
      lesson:
        "Healthcare ML needs metrics aligned to clinical risk, not just a single score.",
    },
    {
      problem:
        "Clinical text can include missing, inconsistent, or noisy fields.",
      solution:
        "Normalize text, validate required inputs, and make missing data behavior explicit in preprocessing.",
      lesson:
        "Data quality handling is part of the model, not a side concern.",
    },
  ],
  requirements: [
    "Python 3.x runtime with Flask.",
    "PyTorch and Transformers packages for model inference.",
    "Trained model and tokenizer artifacts available locally.",
    "Clinical dataset used for training contains approximately 42,000 patient records according to the PRD.",
  ],
  targetAudience: [
    "Healthcare professionals evaluating screening workflows.",
    "Clinical researchers studying early Parkinson's detection.",
    "Medical AI developers discussing responsible model deployment.",
  ],
  futureImprovements: [
    "Add calibrated confidence intervals and threshold selection UI.",
    "Track model card metadata and dataset limitations inside the portal.",
    "Add clinician feedback loops for post-review outcome capture.",
  ],
  interviewQuestions: [
    {
      question: "Why call this decision support instead of diagnosis?",
      answer:
        "The model estimates risk from available text and can be wrong due to data quality, bias, or unseen clinical context. Diagnosis requires clinician judgment, examination, and validated medical workflow.",
      difficulty: "easy",
      category: "behavioral",
    },
    {
      question: "Why are sensitivity and specificity important here?",
      answer:
        "They explain the cost trade-off in medical screening. High sensitivity reduces missed positive cases, while high specificity reduces false alarms. Accuracy alone can hide either failure mode.",
      difficulty: "medium",
      category: "concepts",
    },
    {
      question: "What would you harden before clinical deployment?",
      answer:
        "I would add dataset documentation, external validation, calibration, access controls, audit logging, clinician review loops, model monitoring, and a clear disclaimer workflow.",
      difficulty: "hard",
      category: "tradeoffs",
    },
  ],
  flashcards: [
    {
      front: "What does NeuroAssess predict?",
      back: "A Parkinson's screening risk score for clinical decision support, not a diagnosis.",
      difficulty: "easy",
    },
    {
      front: "Why use a transformer for clinical text?",
      back: "Self-attention can connect distant clinical cues across longer notes better than shallow text features.",
      difficulty: "medium",
    },
    {
      front: "Which metrics matter more than raw accuracy in screening?",
      back: "Sensitivity, specificity, false negatives, false positives, and threshold behavior.",
      difficulty: "hard",
    },
  ],
};
