"""Minimal StateGraph engine (Section 25).

This intentionally mirrors the LangGraph `StateGraph` API — `add_node`,
`add_edge`, `add_conditional_edges`, `set_entry_point`, `compile().invoke()` —
so the whole app runs today with zero extra dependencies, and migrating to real
LangGraph tomorrow is a one-line import swap in workflow.py:

    # today
    from app.graph.engine import StateGraph, END
    # tomorrow
    from langgraph.graph import StateGraph, END

Nodes are callables `(state) -> state`. Conditional edges use a router callable
`(state) -> key` plus a `{key: next_node}` mapping.
"""
from __future__ import annotations

from typing import Callable

END = "__end__"

NodeFn = Callable[[object], object]
RouterFn = Callable[[object], str]


class StateGraph:
    def __init__(self) -> None:
        self._nodes: dict[str, NodeFn] = {}
        self._edges: dict[str, str] = {}
        self._conditional: dict[str, tuple[RouterFn, dict[str, str]]] = {}
        self._entry: str | None = None

    def add_node(self, name: str, fn: NodeFn) -> None:
        self._nodes[name] = fn

    def add_edge(self, src: str, dst: str) -> None:
        self._edges[src] = dst

    def add_conditional_edges(self, src: str, router: RouterFn, mapping: dict[str, str]) -> None:
        self._conditional[src] = (router, mapping)

    def set_entry_point(self, name: str) -> None:
        self._entry = name

    def compile(self) -> "CompiledGraph":
        if self._entry is None:
            raise ValueError("StateGraph has no entry point.")
        return CompiledGraph(self._nodes, self._edges, self._conditional, self._entry)


class CompiledGraph:
    def __init__(self, nodes, edges, conditional, entry, max_steps: int = 64):
        self._nodes = nodes
        self._edges = edges
        self._conditional = conditional
        self._entry = entry
        self._max_steps = max_steps

    def _next(self, node: str, state: object) -> str:
        if node in self._conditional:
            router, mapping = self._conditional[node]
            key = router(state)
            return mapping.get(key, END)
        return self._edges.get(node, END)

    def invoke(self, state: object) -> object:
        node = self._entry
        for _ in range(self._max_steps):
            if node == END:
                break
            fn = self._nodes.get(node)
            if fn is None:
                raise KeyError(f"Graph node '{node}' is not defined.")
            state = fn(state)
            node = self._next(node, state)
        return state
