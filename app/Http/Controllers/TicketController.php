<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService,
    ) {}

    // List Tickets
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'search' => 'string|nullable',
            'status' => [Rule::enum(TicketStatus::class), 'nullable'],
            'page' => 'numeric|nullable',
            'perPage' => 'numeric|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $tickets = $this->ticketService->list($request->all());
        $total = $tickets->total();

        return response()->json([
            'tickets' => $tickets->items(),
            'page' => $tickets->currentPage(),
            'perPage' => $tickets->perPage(),
            'total' => $total,
        ], 200);
    }

    // Create a new Ticket
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => [Rule::enum(TicketStatus::class), 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }


        $ticket = $this->ticketService->create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket
        ], 201);
    }

    // Update a Ticket
    public function update(string $id, Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => [Rule::enum(TicketStatus::class), 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $ticket = $this->ticketService->find($id);
        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket not found',
            ], 404);
        }

        $updated = $this->ticketService->update($id, [
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'created_by' => auth()->id(),
        ]);

        if (!$updated) {
            return response()->json([
                'message' => 'Something went wrong! Please try again later.',
            ], 500);
        }

        $ticket->title = $request->title;
        $ticket->description = $request->description;
        $ticket->status = $request->status;

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket
        ], 200);
    }

    public function delete(string $id): JsonResponse {
        $ticket = $this->ticketService->find($id);
        if (!$ticket || $ticket->created_by !== auth()->id()) {
            return response()->json([
                'message' => 'Ticket not found',
            ], 404);
        }

        $deleted = $this->ticketService->delete($id);

        if (!$deleted) {
            return response()->json([
                'message' => 'Something went wrong! Please try again later.',
            ], 500);
        }

        return response()->json([
            'message' => 'Ticket deleted successfully',
        ], 200);
    }
}
