<?php

namespace App\Services;

use App\Models\Ticket;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TicketService
{
    public function create(array $data)
    {
        return Ticket::query()->create([
            'title' => $data['title'],
            'description' => $data['description'],
            'status' => $data['status'],
            'created_by' => auth()->id(),
        ]);
    }

    public function update(string $id, array $data): int
    {
        return Ticket::query()->find($id)->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'status' => $data['status'],
            'created_by' => auth()->id(),
        ]);
    }

    public function find(string $id) {
        return Ticket::query()->find($id);
    }

    public function list(array $parameters): LengthAwarePaginator
    {
        $query = Ticket::query();

        if (isset($parameters['status']) && $parameters['status'] !== '') {
            $query->where('status', $parameters['status']);
        }

        if (isset($parameters['search']) && $parameters['search'] !== '') {
            $query->where(function($query) use ($parameters) {
                $query->whereLike('title', "%" . $parameters['search'] . "%");
                $query->orWhereLike('description', "%" . $parameters['search'] . "%");
            });
        }

        $perPage = $parameters['perPage'] ?? 12;
        $page = $parameters['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function delete(string $id): ?bool
    {
        return Ticket::query()->find($id)->delete();
    }
}
