import spacy
from spacy.tokens import DocBin
from spacy.cli.train import train
import json
from pathlib import Path
from typing import List, Dict, Any
import random

def create_training_data(
    input_path: str,
    output_path: str,
    split: float = 0.8
) -> None:
    """
    Convert annotated JSON data to spaCy's binary format.
    
    Args:
        input_path: Path to JSON file containing annotated data
        output_path: Directory to save training and evaluation data
        split: Train/test split ratio
    """
    nlp = spacy.blank("en")
    db_train = DocBin()
    db_eval = DocBin()
    
    # Load annotated data
    with open(input_path, 'r', encoding='utf-8') as f:
        training_data = json.load(f)
    
    # Shuffle data
    random.shuffle(training_data)
    split_idx = int(len(training_data) * split)
    train_data = training_data[:split_idx]
    eval_data = training_data[split_idx:]
    
    # Process training data
    for item in train_data:
        doc = nlp.make_doc(item["text"])
        ents = []
        for start, end, label in item["entities"]:
            span = doc.char_span(start, end, label=label)
            if span:
                ents.append(span)
        doc.ents = ents
        db_train.add(doc)
    
    # Process evaluation data
    for item in eval_data:
        doc = nlp.make_doc(item["text"])
        ents = []
        for start, end, label in item["entities"]:
            span = doc.char_span(start, end, label=label)
            if span:
                ents.append(span)
        doc.ents = ents
        db_eval.add(doc)
    
    # Save binary files
    db_train.to_disk(Path(output_path) / "train.spacy")
    db_eval.to_disk(Path(output_path) / "eval.spacy")

def create_config(
    output_path: str,
    train_path: str,
    eval_path: str
) -> None:
    """Create SpaCy training config."""
    config = {
        "paths": {
            "train": train_path,
            "dev": eval_path
        },
        "system": {
            "gpu_allocator": "pytorch"
        },
        "corpora": {
            "train": {
                "path": train_path
            },
            "dev": {
                "path": eval_path
            }
        },
        "training": {
            "dev_corpus": "corpora.dev",
            "train_corpus": "corpora.train",
            "optimizer": {
                "@optimizers": "Adam.v1",
                "beta1": 0.9,
                "beta2": 0.999,
                "L2_is_weight_decay": True,
                "L2": 0.01,
                "grad_clip": 1.0,
                "use_averages": False,
                "eps": 1e-8
            },
            "batcher": {
                "@batchers": "spacy.batch_by_words.v1",
                "discard_oversize": True,
                "size": 2000,
                "tolerance": 0.2,
                "get_length": None
            },
            "logger": {
                "@loggers": "spacy.ConsoleLogger.v1",
                "progress_bar": False
            },
            "optimizer": {
                "@optimizers": "Adam.v1",
                "beta1": 0.9,
                "beta2": 0.999,
                "L2_is_weight_decay": True,
                "L2": 0.01,
                "grad_clip": 1.0,
                "use_averages": False,
                "eps": 1e-8
            },
            "dropout": 0.1,
            "patience": 1600,
            "max_epochs": 0,
            "max_steps": 20000,
            "eval_frequency": 200
        },
        "nlp": {
            "lang": "en",
            "pipeline": ["tok2vec", "ner"],
            "batch_size": 1000,
            "disabled": [],
            "before_creation": None,
            "after_creation": None,
            "after_pipeline_creation": None
        },
        "components": {
            "tok2vec": {
                "factory": "tok2vec",
                "model": {
                    "@architectures": "spacy.Tok2Vec.v2",
                    "embed": {
                        "@architectures": "spacy.MultiHashEmbed.v2",
                        "width": 96,
                        "attrs": ["ORTH", "SHAPE"],
                        "rows": [5000, 2500],
                        "include_static_vectors": False
                    },
                    "encode": {
                        "@architectures": "spacy.MaxoutWindowEncoder.v2",
                        "width": 96,
                        "depth": 4,
                        "window_size": 1,
                        "maxout_pieces": 3
                    }
                }
            },
            "ner": {
                "factory": "ner",
                "model": {
                    "@architectures": "spacy.TransitionBasedParser.v2",
                    "state_type": "ner",
                    "extra_state_tokens": False,
                    "hidden_width": 64,
                    "maxout_pieces": 2,
                    "use_upper": True,
                    "nO": None
                }
            }
        }
    }
    
    config_path = Path(output_path) / "config.cfg"
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2)

def train_model(
    output_dir: str,
    train_path: str,
    eval_path: str,
    config_path: str
) -> None:
    """Train the SpaCy model."""
    train(
        config_path,
        output_dir,
        overrides={
            "paths.train": train_path,
            "paths.dev": eval_path
        }
    )

if __name__ == "__main__":
    # Example usage
    data_dir = Path("data")
    model_dir = Path("models")
    
    # Create directories if they don't exist
    data_dir.mkdir(exist_ok=True)
    model_dir.mkdir(exist_ok=True)
    
    # Create training data
    create_training_data(
        "data/annotated_legal_docs.json",
        str(data_dir)
    )
    
    # Create config
    create_config(
        str(model_dir),
        str(data_dir / "train.spacy"),
        str(data_dir / "eval.spacy")
    )
    
    # Train model
    train_model(
        str(model_dir),
        str(data_dir / "train.spacy"),
        str(data_dir / "eval.spacy"),
        str(model_dir / "config.cfg")
    ) 